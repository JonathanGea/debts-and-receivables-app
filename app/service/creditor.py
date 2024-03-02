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
            'estimated_return_date': row[4],
            
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
            'status': row[3],
            'id': row[4],
            'submitted_at': row[5],
            'creditor_send_money_at': row[6],
            'debtor_pay_at': row[7],
            'creditor_approved_payment_at': row[8],
            'payment_receipt_filename_creditor': row[9],
            'payment_receipt_filename_debitor': row[10]           
        }
        loan_dicts.append(loan_dict)

    return loan_dicts

def getCreditorOrders():
    result = creditor.getCreditorOrders()
    transactionDicts = []
    for row in result:
        transactionDict = {
            'debtorId': row[0],
            'debtor': row[1],
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
        transactionDicts.append(transactionDict)
    return transactionDicts

def getCreditorHistorys():
    result = creditor.getCreditorHistorys()
    transactionDicts = []
    for row in result:
        transactionDict = {
            'debtorId': row[0],
            'debtor': row[1],
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
        transactionDicts.append(transactionDict)
    return transactionDicts

def createMoneyTransferToDebtor(file,transactionsId):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"proof_money_tranfer_to_debtor_{timestamp}.jpg"
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    print ("transactionsId : ", transactionsId)
    result = creditor.changeTransaksiStatusToUnpaid(filename,transactionsId)    
    return result

def approvedPaymentFromDebtor(transactionsId):
    print ("transactionsId : ", transactionsId)
    result = creditor.changeTransaksiStatusToCompleted(transactionsId)    
    return result