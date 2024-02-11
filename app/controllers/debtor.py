from app import app
from flask import jsonify,request
import app.service.debtor as debtor

"""

getDebts
getDebt => masih dipertimbangkan
getDebtorOrder 
getDebtorHistory 
"""

@app.route("/api/debtor/debts", methods=["GET"])
def getDebts():
    try:
        data = debtor.getDebts()
        
        return jsonify({"data": data}), 200
    except Exception as e:
        print("Error:", str(e))
        
        return jsonify({"message": "Failewd to retrieve debtor debts"}), 500
    
@app.route("/api/debtor/orders", methods=["GET"])
def getDebtorOrders():
    try:
        data = debtor.getDebtorOrders()
        
        return jsonify({"data": data}), 200
    except Exception as e:
        print("Error:", str(e))
        
        return jsonify({"message": "Failewd to retrieve debtor orders"}), 500
    
@app.route("/api/debt", methods=["POST"])
def createTransaction():
    try:
        amount = request.form['amount']
        creditorId = request.form['creditorId']
        description = request.form['description']
        estimatedReturnDate = request.form['estimatedReturnDate']

        if debtor.createTransaction(creditorId,amount,description,estimatedReturnDate) is True :
            return jsonify({"message": "ok"}), 200
        return jsonify({"message": "failed"}), 400
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": "Failed to create user"}), 500