from app import app
from flask_login import current_user
from app.utils.query import *

def getCreditorReceivables():
    try:
        query = """
        SELECT
            debtor.id AS id,
            debtor.name AS debtor,
            SUM(debt.amount) AS total_amount
        FROM
            debt.debt AS debt
        JOIN
            debt."user" AS debtor ON debt.debtor_id = debtor.id
        WHERE
            debt.creditor_id = %(creditor_id)s 
            AND debt.status = 'unpaid'
        GROUP BY
            debtor.id;
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
            SUM(debt.amount) AS total_amount,
            debt.status
        FROM
            debt.debt AS debt
        JOIN
            debt."user" AS debtor ON debt.debtor_id = debtor.id
        WHERE
            debt.creditor_id = %(creditor_id)s and
            debt.status IN ('submitted', 'awaiting creditor approval')
        GROUP BY
            debtor.id,
            debtor.name,
            debt.status;
            """
        parameter = {'creditor_id': current_user.id}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = fetchesQuery(query,parameter)
        return result
    except Exception as e:
        app.logger.error(f"error in getCreditorReceivables: {e}")
        return False