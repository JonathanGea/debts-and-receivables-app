from app import app
from flask import jsonify,request
import app.service.creditor as creditor
import app.service.debts as debts

    


@app.route("/api/payment", methods=["POST"])
def createPayment():
    try:
        creditorId = request.form['creditorId']
        amount = request.form['amount']
        file = request.files['file']
        debts.createPayment(file,creditorId,amount)
        return jsonify({"message": "ok"}), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": "Failed to create user"}), 500
    
@app.route("/api/debs/detail", methods=["POST"])
def getDetails():
    try:
        creditorId = request.form['creditorId']
        print(creditorId)

        data = debts.getDebtByCreditor(creditorId)
        return  jsonify({"data": data}), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": "Failed to create user"}), 500
    

@app.route("/api/creditors", methods=["GET"])
def getcreditors():
    try:
        data = creditor.getcreditorLoans()
        return jsonify({"data": data}), 200
    except Exception as e:
        print("Error:", str(e))
        
        return jsonify({"message": "Failed to retrieve creditors"}), 500