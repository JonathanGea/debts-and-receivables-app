from app import app
from flask_login import current_user
from app.utils.query import *

def getDebts():
    try:
        query = """
        SELECT
            creditor.id AS id,
            creditor.name AS creditor,
            SUM(debt.amount) AS total_amount
        FROM
            debt.debt AS debt
        JOIN
            debt."user" AS creditor ON debt.creditor_id = creditor.id
        WHERE
            debt.debtor_id = %(debtor_id)s 
            AND debt.status = 'unpaid'
        GROUP BY
            creditor.id;
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
            debt.creditor_id AS id,
            creditor.name AS creditor,
            SUM(CASE WHEN debt.status = 'submitted' OR debt.status = 'Paid' THEN debt.amount ELSE 0 END) AS total_amount,
            debt.status
        FROM
            debt.debt as debt
        JOIN
            debt."user" AS creditor ON debt.creditor_id = creditor.id
        where
            debt.debtor_id = %(debtor_id)s  and
            debt.status IN ('submitted', 'awaiting creditor approval')
        GROUP BY
            debt.creditor_id,
            creditor.name,
            debt.status;

            """
        parameter = {'debtor_id': current_user.id}
        app.logger.info(f'executing SQL query: {query}, Parameters: {parameter}')

        result = fetchesQuery(query,parameter)
        return result
    except Exception as e:
        app.logger.error(f"error in getDebts: {e}")
        return False