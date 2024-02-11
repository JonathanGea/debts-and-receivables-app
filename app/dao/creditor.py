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
            transactions.status
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