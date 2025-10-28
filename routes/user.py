from flask import Blueprint

user_bp = Blueprint('user', __name__)

@user_bp.route('/user_info')
def user_info():
    return "User info here"
