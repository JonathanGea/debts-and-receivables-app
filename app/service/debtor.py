from app import app
from datetime import datetime
from decimal import Decimal
import os
import app.dao.debtor as debtor

UPLOAD_FOLDER = 'app/static/uploads/debtor'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def getDebts():
    result = debtor.getDebts()
    debtDicts = []
    for row in result:
        debtDict = {
            'creditorId': row[0],
            'creditor': row[1],
            'total_amount': float(row[2]),
            'id': row[3]
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
            'status': row[3],
            'id': row[4],
            'submitted_at': row[5],
            'creditor_send_money_at': row[6],
            'debtor_pay_at': row[7],
            'creditor_approved_payment_at': row[8],
            'payment_receipt_filename_creditor': row[9],
            'payment_receipt_filename_debitor': row[10]
        }
        debtDicts.append(debtDict)
    return debtDicts

def getDebtorHistorys():
    result = debtor.getDebtorHistorys()
    debtDicts = []
    for row in result:
        debtDict = {
            'creditorId': row[0],
            'creditor': row[1],
            'total_amount': float(row[2]),
            'status': row[3],
            'id': row[4],
            'submitted_at': row[5],
            'creditor_send_money_at': row[6],
            'debtor_pay_at': row[7],
            'creditor_approved_payment_at': row[8],
            'payment_receipt_filename_creditor': row[9],
            'payment_receipt_filename_debitor': row[10]
        }
        debtDicts.append(debtDict)
    print(debtDicts)
    return debtDicts

def createTransaction(creditorId,amount,description,estimatedReturnDate):
    result = debtor.createTransaction(creditorId,amount,description,estimatedReturnDate)
    return result

def debtorPayDebt(file,transactionsId):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"payment_receipt_debtor_{timestamp}.jpg"
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    print ("transactionsId : ", transactionsId)
    result = debtor.changeTransaksiStatusToWaitingforPaymentApproval(filename, transactionsId)    
    return result