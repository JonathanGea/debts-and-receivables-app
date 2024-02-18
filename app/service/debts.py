from app import app
from datetime import datetime
from decimal import Decimal
import os
import app.dao.debts as debt
# Ganti dengan direktori tempat Anda ingin menyimpan file gambar
UPLOAD_FOLDER = 'app/static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER





def createPayment(file,creditorId,amount):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"proof_payment_{timestamp}.jpg"  # Ganti .jpg dengan ekstensi file yang sesuai
    amount_numeric = Decimal(''.join(filter(str.isdigit, amount.replace(',', ''))))
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    newPaymentId = debt.createPayment(creditorId,amount_numeric,filename)
    print("newPaymentId", newPaymentId)
    if (newPaymentId is not None):
        debt.updateDebtStatus(creditorId, newPaymentId)
    return None

def getDebtByCreditor(creditorId):
    result = debt.getDebtByCreditor(creditorId)
    debtDicts = []
    for row in result:
        debtDict = {
            'debt_id': row[0],
            'creditor': row[1],
            'debtor': row[2],
            'debt_amount': float(row[3]),
            'debt_description': row[4],
            'debt_estimated_return_date': row[5],
            'debt_status': row[6],
            'payment_created_at': row[7], 
            'payment_receipt_filename': row[8], 
        }
        debtDicts.append(debtDict)
    print(debtDicts)
    return debtDicts


# debtDict = {
#             'creditor': row[0],
#             'total_amount': float(row[1]), 
#             'description': row[2],
#             'created_at': row[3],
#             'estimated_return_date': row[4]
#         }