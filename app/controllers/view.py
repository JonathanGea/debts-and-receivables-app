from app import app
from flask import render_template, redirect, url_for, jsonify
from flask_login import login_required, current_user
import app.service.creditor as creditorServiece
import app.service.debts as debtsService
import app.service.user as userService
from app.utils import *

@app.route('/')
@login_required
def home():
    return render_template("dashboard.html")

@login_required
@app.route('/dashboard')
def dashboard():
    return redirect(url_for('dashboardcreditor'))

@app.route('/dashboard/creditor')
@login_required
def dashboardcreditor():
    currentUser = {
        "email": current_user.email,  
        "name": current_user.name,   
    }
    return render_template('dashboard/dashboardcreditor.html', currentUser=currentUser)

@app.route('/dashboard/borrower')
@login_required
def dashboardborrower():
    currentUser = {
        "email": current_user.email,  
        "name": current_user.name,   
    }
    return render_template('dashboard/debtor.html', currentUser=currentUser)


@app.route('/dashboard/borrower/<creditorId>')
@login_required
def debsDetail(creditorId):  
    dataCreditor = userService.getUser(creditorId)  
    return render_template('dashboard/detail/debts.html', dataCreditor=dataCreditor)  

@app.route('/index')
@login_required
def index():
    return render_template('dashboard.html')


from app.utils.query import (
    fetchQuery
)

@app.route('/db')
def db():
    try :    
        query = """
            SELECT NOW() AS current_time;
            """
        result = fetchQuery(query)
    except :
        result = "database gagal"
    return jsonify(result)
