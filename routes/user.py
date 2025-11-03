from flask import Blueprint, request, jsonify
from database.user_queries import add_user, change_user_name, get_connection
from database.user_queries import get_user

user_bp = Blueprint('user', __name__)

@user_bp.route('/user_info')
def user_info():
    return "User info here"


@user_bp.route('/create_user/<name>')
def create_user(name):
    data = add_user(name)
    return data

@user_bp.route('/update_settings', methods=['POST'])   
def update_settings():
    data = request.get_json()
    user_name = data.get('user_name', '')
    user = get_user()
    user_id = user['id']

    change_user_name(user_id, user_name)
    return jsonify(status="success", message="Settings updated")