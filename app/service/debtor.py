from app import app
from datetime import datetime
from decimal import Decimal
# import os
import app.dao.debtor as debtor

# UPLOAD_FOLDER = 'app/static/uploads'
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


"""
getDebt ✅
getDebtorOrder  ✅
getDebtorHistory 
create transaktion ✅
"""

def getDebts():
    result = debtor.getDebts()
    debtDicts = []
    for row in result:
        debtDict = {
            'creditorId': row[0],
            'creditor': row[1],
            'total_amount': float(row[2])
        }
        debtDicts.append(debtDict)
    return debtDicts


def getDebtorOrders():
    result = debtor.getDebtorOrders()
    debtDicts = []
    for row in result:
        debtDict = {
            'creditorId': row[0],
            'creditor': row[1],
            'total_amount': float(row[2]),
            'status': row[3]
        }
        debtDicts.append(debtDict)
    return debtDicts

def createTransaction(creditorId,amount,description,estimatedReturnDate):
    result = debtor.createTransaction(creditorId,amount,description,estimatedReturnDate)
    return result