from app import app
from flask import jsonify,request
import app.service.user as user

@app.route("/api/users", methods=["GET"])
def getUsers():
    try:
        data = user.getUsers()
        return jsonify({"data": data}), 200
    except Exception as e:
        print("Error:", str(e))
        
        return jsonify({"message": "Failed to retrieve users"}), 500
    

@app.route("/api/users/unique_code", methods=["POST"])
def getUserByUniquecode():
    try:
        uniquecode = request.form['uniquecode']
        data = user.getUserByUniqueCode(uniquecode)
        print("controler data getCreditorByUniqueCode", data)
        if data is not None:
            return jsonify({"data": data}), 200
        else :
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        print("Error:", str(e))
        
        return jsonify({"message": "Failed to retrieve users"}), 500