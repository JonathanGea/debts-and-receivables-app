import app.dao.debts as debt

def getDebt():
    result = debt.getDebt()
    loan_dicts = []
    for row in result:
        loan_dict = {
            'creditor': row[0],
            'amount': float(row[1]), 
            'description': row[2],
            'created_at': row[3],
            'estimated_return_date': row[4]
        }
        loan_dicts.append(loan_dict)

    return loan_dicts