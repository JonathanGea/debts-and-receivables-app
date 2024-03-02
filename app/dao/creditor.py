from app import app
from flask_login import current_user
from app.utils.query import *

def getCreditorReceivables():
    try:
        query = """
        SELECT
            debtor.id AS id,
            debtor.name AS creditor,
            transactions.amount AS amount
        FROM
            "debts-and-receivables-app".transactions AS transactions
        JOIN
            "debts-and-receivables-app".users AS debtor ON transactions.debtor_id = debtor.id
        WHERE
            transactions.debtor_id = %(creditor_id)s  
            AND transactions.status = 'unpaid'
            """
        parameter = {'creditor_id': current_user.id}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = fetchesQuery(query,parameter)
        return result
    except Exception as e:
        app.logger.error(f"error in getCreditorReceivables: {e}")
        return False

def getCreditorOrders():
    try:
        query = """
        SELECT
            debtor.id AS id,
            debtor.name AS debtor,
            transactions.amount AS amount,
            transactions.status,
            transactions.id
        FROM
            "debts-and-receivables-app".transactions AS transactions
        JOIN
            "debts-and-receivables-app".users AS debtor ON transactions.debtor_id = debtor.id
        WHERE
            transactions.creditor_id = %(creditor_id)s and
            transactions.status IN ('submitted', 'awaiting creditor approval')
            """
        parameter = {'creditor_id': current_user.id}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = fetchesQuery(query,parameter)
        return result
    except Exception as e:
        app.logger.error(f"error in getCreditorReceivables: {e}")
        return False

def getCreditorHistorys():
    try:
        query = """
        SELECT
            debtor.id AS id,
            debtor.name AS debtor,
            transactions.amount AS amount,
            transactions.status,
            transactions.id
        FROM
            "debts-and-receivables-app".transactions AS transactions
        JOIN
            "debts-and-receivables-app".users AS debtor ON transactions.debtor_id = debtor.id
        WHERE
            transactions.creditor_id = %(creditor_id)s and
            transactions.status = 'completed'
            """
        parameter = {'creditor_id': current_user.id}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = fetchesQuery(query,parameter)
        return result
    except Exception as e:
        app.logger.error(f"error in getCreditorReceivables: {e}")
        return False
    
def changeTransaksiStatusToUnpaid(filename,transactionsId):
    try:
        query = """
        UPDATE 
            "debts-and-receivables-app".transactions 
        SET 
            status = 'unpaid',
            creditor_send_money_at = CURRENT_TIMESTAMP,
            payment_receipt_filename_creditor = %(filename)s
        WHERE 
            id = %(transactionsId)s
            """
        parameter = {
            'transactionsId': transactionsId,
            'filename': filename
            }
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')
        result = executeQuery(query,parameter)
        return result
    except Exception as e:
        app.logger.error(f"error in changeTransaksiStatusToUnpaid: {e}")
        return False
    
def changeTransaksiStatusToCompleted(transactionsId):
    try:
        query = """
        UPDATE 
            "debts-and-receivables-app".transactions 
        SET 
            status = 'completed',
            creditor_approved_payment_at = CURRENT_TIMESTAMP
        WHERE 
            id = %(transactionsId)s
            """
        parameter = {'transactionsId': transactionsId}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')
        result = executeQuery(query,parameter)
        return result
    except Exception as e:
        app.logger.error(f"error in changeTransaksiStatusToCompleted: {e}")
        return False