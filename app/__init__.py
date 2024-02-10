from flask import Flask

app = Flask(__name__)

UPLOAD_FOLDER = 'app/static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER





# import controller 


from app.controllers.debtor import *
from app.controllers.creditor import *
from app.controllers.user import *
from app.controllers.debts import *
from app.controllers.view import *
from app.controllers.authentication import *


