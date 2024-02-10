import app
import app.dao.creditor as creditor

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
            'status': row[3]
        }
        debtDicts.append(debtDict)
    return debtDicts