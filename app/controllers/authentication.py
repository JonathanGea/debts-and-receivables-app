from app import app
from flask import render_template, redirect, url_for, request, jsonify
from flask_login import LoginManager, UserMixin, login_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from app.dao.user import (
    getUserByEmail,
    getUserById,
    createUsersDao
)

app.secret_key = 'afnacjlnldcfhnahdsjcbxcbadhfrfe'  # Change this to a secure secret key

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, idUser, name, email, password, uniqueCode):
        self.id = idUser
        self.name = name
        self.email = email
        self.password = password
        self.uniqueCode = uniqueCode


@login_manager.user_loader
def load_user(id):
    userData = getUserById(id)  
    if userData:
        return User(*userData) 
    else:
        return None

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET' :
        return render_template('authentication/login.html')
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        userData = getUserByEmail(email)  
        if userData is not None:
            user = User(userData[0], userData[1], userData[2], userData[3], userData[4])
            if check_password_hash(user.password, password):
                login_user(user)
                
                return jsonify({"message": "Registration successful", "redirect_url": url_for('home')}), 200
            else:
                print("login gagal")
                return jsonify({"message": "Failed login"}), 401 
        else:
            return jsonify({"message": "Failed login"}), 401 
        

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET' :
        return render_template('authentication/register.html')
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']
    if not email or not password or not name:
        return jsonify({"message": "Please provide both email and password and name"}), 400
    
    hashed_password = generate_password_hash(password)
    result = createUsersDao(name, email, hashed_password)
    
    if result:  
        userData = getUserByEmail(email)
        user = User(userData[0], userData[1], userData[2], userData[3], userData[4])
        login_user(user)
        return jsonify({"message": "Registration successful", "redirect_url": url_for('home')}), 200

    return jsonify({"message": "Registration failed. Please try again."}), 400


@login_manager.unauthorized_handler
def unauthorized():
    return redirect(url_for('login'))


