from app import app
from flask_login import current_user
from app.utils.query import *

def getDebts():
    try:
        query = """
        SELECT
            creditor.id AS id,
            creditor.name AS creditor,
            transactions.amount AS amount
        FROM
            "debts-and-receivables-app".transactions AS transactions
        JOIN
            "debts-and-receivables-app".users AS creditor ON transactions.creditor_id = creditor.id
        WHERE
            transactions.debtor_id = %(debtor_id)s 
            AND transactions.status = 'unpaid'
        """
        parameter = {'debtor_id': current_user.id}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = fetchesQuery(query,parameter)
        return result
    except Exception as e:
        app.logger.error(f"error in getDebts: {e}")
        return False
    
def getDebtorOrders():
    try:
        query = """
        SELECT
            creditor.id AS id,
            creditor.name AS creditor,
            transactions.amount AS amount,
            transactions.status
        FROM
            "debts-and-receivables-app".transactions AS transactions
        JOIN
            "debts-and-receivables-app".users AS creditor ON transactions.creditor_id = creditor.id
        WHERE
            transactions.debtor_id = %(debtor_id)s and
            transactions.status IN ('submitted', 'awaiting creditor approval')

            """
        parameter = {'debtor_id': current_user.id}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = fetchesQuery(query,parameter)
        return result
    except Exception as e:
        app.logger.error(f"error in getDebtorOrders: {e}")
        return False
    
def createTransaction(creditorId,amount,description,estimatedReturnDate):
    try:
        query = """
            INSERT INTO "debts-and-receivables-app".transactions 
                (creditor_id, debtor_id, amount, description, estimate_return_at)
            VALUES 
                (%(creditorId)s,  %(current_user)s, %(amount)s, %(description)s, %(estimatedReturnDate)s);
            """
        parameters = {
            'creditorId': creditorId,
            'current_user': current_user.id,
            'amount': amount,
            'description': description,
            'estimatedReturnDate': estimatedReturnDate
        }
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameters}')
        result = executeQuery(query,parameters)
        app.logger.info(f'result: {result}')

        return result
    except Exception as e:
        print(f"Error in getcreditorLoans: {e}")
        return False