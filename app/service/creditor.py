from app import app
import app.dao.creditor as creditor
import app.service.debtor as debtor 

from datetime import datetime
from decimal import Decimal
import os

UPLOAD_FOLDER = 'app/static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def getcreditorLoans():
    result = creditor.getcreditorLoans()
    loan_dicts = []
    for row in result:
        loan_dict = {
            'borrower': row[0],
            'amount': float(row[1]), 
            'description': row[2],
            'created_at': row[3],
            'estimated_return_date': row[4]
        }
        loan_dicts.append(loan_dict)

    return loan_dicts

def getCreditorReceivables():
    result = creditor.getCreditorReceivables()
    loan_dicts = []
    for row in result:
        loan_dict = {
            'id': row[0],
            'debtor': row[1],
            'total_amount': float(row[2]), 
        }
        loan_dicts.append(loan_dict)

    return loan_dicts

def getCreditorOrders():
    result = creditor.getCreditorOrders()
    debtDicts = []
    for row in result:
        debtDict = {
            'debtorId': row[0],
            'debtor': row[1],
            'total_amount': float(row[2]),
            'status': row[3],
            'id': row[4]
        }
        debtDicts.append(debtDict)
    return debtDicts

def createMoneyTransferToDebtor(file,transactionsId):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"proof_money_tranfer_to_debtor_{timestamp}.jpg"
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    print ("transactionsId : ", transactionsId)
    result = creditor.changeTransaksiStatusToUnpaid(transactionsId)    
    return result