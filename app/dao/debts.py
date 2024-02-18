from app import app
from flask_login import current_user
from app.utils.query import *


def getDebtByCreditor(creditorId):
    try:
        query = """
        SELECT
            d.id AS debt_id,
            u_creditor.name AS creditor,
            u_debtor.name AS debtor,
            d.amount AS debt_amount,
            d.description AS debt_description,
            d.estimated_return_date AS debt_estimated_return_date,
            d.status AS debt_status,
            CASE
                WHEN d.payment_id IS NOT NULL THEN p.created_at
                ELSE NULL
            END AS payment_created_at,
            CASE
                WHEN d.payment_id IS NOT NULL THEN p.payment_receipt_filename
                ELSE NULL
            END AS payment_receipt_filename,
            CASE
                WHEN d.payment_id IS NOT NULL THEN p.status
                ELSE NULL
            END AS payment_status
        FROM
            debt.debt d
        JOIN debt."user" u_creditor ON d.creditor_id = u_creditor.id
        JOIN debt."user" u_debtor ON d.debtor_id = u_debtor.id
        LEFT JOIN debt.payment p ON d.payment_id = p.id
        WHERE
            u_creditor.id = %(creditor_id)s
            AND u_debtor.id = %(debtor_id)s;


            """
        parameter = {
            'debtor_id': current_user.id,
            'creditor_id': creditorId
            }
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = fetchesQuery(query,parameter)
        return result
    except Exception as e:
        app.logger.error(f"error in getDebtByCreditor: {e}")
        return False

def getDebt():
    try:
        query = """
            SELECT "creditor".name AS creditor, debt.amount, debt.description, debt.created_at ,debt.estimated_return_date
            FROM debt.debt as debt
            JOIN "debt"."user" as "creditor" ON debt.creditor_id = "creditor".id
            WHERE debt.debtor_id = %(current_user)s;
            """
        parameter = {'current_user': current_user.id}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = fetchesQuery(query,parameter)
        return result
    except Exception as e:
        print(f"Error in getcreditorLoans: {e}")
        return False
    


@log_function_execution
def createPayment(creditorId,amount,payment_receipt_filename):
    try:
        query = """
        INSERT INTO debt.payment (
            creditor_id,
            debtor_id,
            amount,
            payment_receipt_filename
        ) VALUES (
            %(creditorId)s,
            %(debtorId)s,
            %(amount)s,
            %(payment_receipt_filename)s
        )
        RETURNING id;
            """
        parameters = {
            'creditorId': creditorId,
            'debtorId': current_user.id,
            'amount': amount,
            'payment_receipt_filename': payment_receipt_filename
        }
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameters}')
        result = executeQueryWithReturn(query,parameters)
        app.logger.info(f'result: {result}')

        return result
    except Exception as e:
        print(f"Error in createPayment: {e}")
        return False

def updateDebtStatus(creditorId, paymentId ):
    try:
        query = """
            UPDATE 
                debt.debt
            SET 
                status = 'awaiting creditor approval',
                payment_id = %(paymentId)s
            WHERE 
                status = 'unpaid' AND creditor_id = %(creditorId)s and debtor_id = %(debtorId)s;
            """
        parameters = {
            'creditorId': creditorId,
            'debtorId': current_user.id,
            'paymentId': paymentId
        }
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameters}')
        result = executeQuery(query,parameters)
        app.logger.info(f'result: {result}')

        return result
    except Exception as e:
        print(f"Error in getcreditorLoans: {e}")
        return False





def getcreditorLoans():
    try:
        query = """
            SELECT "debtor".name AS debtor, debt.amount, debt.description, debt.created_at ,debt.estimated_return_date
            FROM debt.debt as debt
            JOIN "debt"."user" as "debtor" ON debt.debtor_id = "debtor".id
            WHERE debt.creditor_id = %(current_user)s;
            """
        parameter = {'current_user': current_user.id}

        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')
        result = fetchesQuery(query,parameter)

        return result
    except Exception as e:
        print(f"Error in getcreditorLoans: {e}")
        return False
    
