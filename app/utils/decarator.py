from app import app
from flask_login import current_user

@app.context_processor
def inject_user():
    if current_user.is_authenticated:
        currentUser = {
            "email": current_user.email,
            "name": current_user.name,
            "uniqueCode": current_user.uniqueCode,
        }
    else:
        currentUser = None

    return dict(currentUser=currentUser)