from app import app
from flask import jsonify,request
import app.service.creditor as creditor


@app.route("/api/creaditor/receivables", methods=["GET"])
def getCreditorReceivables():
    try:
        data = creditor.getCreditorReceivables()
        
        return jsonify({"data": data}), 200
    except Exception as e:
        print("Error:", str(e))
        
        return jsonify({"message": "Failed to retrieve creditor receivables"}), 500
    
@app.route("/api/creditor/orders", methods=["GET"])
def getCreditorOrders():
    try:
        data = creditor.getCreditorOrders()
        
        return jsonify({"data": data}), 200
    except Exception as e:
        print("Error:", str(e))
        
        return jsonify({"message": "Failed to retrieve debtor orders"}), 500
    
@app.route("/api/creditor/createMoneyTransferToDebtor", methods=["POST"])
def createMoneyTransferToDebtor():
    try:
        transactionsId = request.form['transactionsId']
        file = request.files['file']
        creditor.createMoneyTransferToDebtor(file,transactionsId)
        return jsonify({"message": "ok"}), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": "Failed"}), 500