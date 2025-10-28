# exposes all the task routes to the fask app

from flask import Blueprint, jsonify, request
from urllib.parse import unquote
import sqlite3
from database.db import get_connection
from database.task_queries import delete_task_from_db
from database.user_queries import get_user
from database.task_queries import get_tasks
from database.user_queries import get_user

user = get_user()

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route("/completed_task/<name>", methods=["POST"])
def completed_task(name):
    name = unquote(name)
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks WHERE task_name = ?", (name,))
    row = cursor.fetchone()
    if not row:
        return jsonify({"error": "Task not found"}), 404

    coin_reward = row['coin_reward']
    xp_reward = row['xp_reward']

    cursor.execute("SELECT * FROM character_stats LIMIT 1")
    stats = cursor.fetchone()

    level = stats['level']
    coins = stats['coins']
    xp = stats['xp']
    xp_to_next_level = stats['xp_to_next_level']

    new_xp = xp + xp_reward
    new_level = level
    new_xp_to_next_level = xp_to_next_level

    while new_xp >= new_xp_to_next_level:
        new_xp -= new_xp_to_next_level
        new_level += 1
        new_xp_to_next_level = int(new_xp_to_next_level * 1.2)

    new_coins = coins + coin_reward

    cursor.execute("""
        UPDATE character_stats
        SET level = ?, coins = ?, xp = ?, xp_to_next_level = ?
    """, (new_level, new_coins, new_xp, new_xp_to_next_level))

    cursor.execute("UPDATE tasks SET completed = ? WHERE task_name = ?", (True, name))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "task": name,
        "xp_gained": xp_reward,
        "coins_gained": coin_reward,
        "new_level": new_level,
        "new_xp": new_xp
    })

@tasks_bp.route("/uncomplete_task/<name>", methods=["POST"])
def uncomplete_task(name):
    name = unquote(name)
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # 1️⃣ Get task rewards
    cursor.execute("SELECT * FROM tasks WHERE task_name = ?", (name,))
    row = cursor.fetchone()
    if not row:
        return jsonify({"error": "Task not found"}), 404

    coin_reward = row['coin_reward']
    xp_reward = row['xp_reward']

    # 2️⃣ Get current character stats
    cursor.execute("SELECT * FROM character_stats LIMIT 1")
    stats = cursor.fetchone()

    level = stats['level']
    coins = stats['coins']
    xp = stats['xp']
    xp_to_next_level = stats['xp_to_next_level']

    # 3️⃣ Subtract XP and check for level down
    new_xp = xp - xp_reward
    new_level = level
    new_xp_to_next_level = xp_to_next_level

    # If XP drops below 0, go down a level (if possible)
    while new_xp < 0 and new_level > 1:
        new_level -= 1
        new_xp_to_next_level = int(new_xp_to_next_level / 1.2)
        new_xp += new_xp_to_next_level  # regain XP from previous level

    # Prevent XP from going below 0 at level 1
    if new_level == 1 and new_xp < 0:
        new_xp = 0

    # 4️⃣ Subtract coins but not below 0
    new_coins = max(0, coins - coin_reward)

    # 5️⃣ Update DB
    cursor.execute("""
        UPDATE character_stats
        SET level = ?, coins = ?, xp = ?, xp_to_next_level = ?
    """, (new_level, new_coins, new_xp, new_xp_to_next_level))

    cursor.execute(
        "UPDATE tasks SET completed = ? WHERE task_name = ?",
        (False, name)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "task": name,
        "xp_removed": xp_reward,
        "coins_removed": coin_reward,
        "new_level": new_level,
        "new_xp": new_xp,
        "new_coins": new_coins
    })

@tasks_bp.route('/delete_task/<task_id>', methods=['POST'])
def delete_task(task_id):
    delete_task_from_db(task_id)

    return jsonify({"success": True})

@tasks_bp.route('/add_task', methods=['POST'])
def add_task():
    task_name = request.form.get('task_name')
    coin_reward = request.form.get('coin_reward')
    xp_reward = request.form.get('xp_reward')
    start_time = request.form.get('start_time')
    end_time = request.form.get('end_time')
    repeat_days = request.form.getlist('repeat_days')

    if repeat_days:
     repeat_days_str = ",".join(repeat_days)
    else:
     repeat_days_str = None  # or use "" if you prefer

    if start_time == "":
        start_time = None

    if end_time == "":
        end_time = None

    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()

    # Insert the data
    cursor.execute('''
    INSERT INTO tasks (user_id, task_name, coin_reward, xp_reward, start_time, end_time, repeat_days)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (user["id"], task_name, coin_reward, xp_reward, start_time, end_time, repeat_days_str))

    task_id = cursor.lastrowid

    conn.commit()
    conn.close() 

    task = {
    "task_id": task_id,
    "task_name": request.form.get('task_name'),
    "coin_reward": request.form.get('coin_reward'),
    "xp_reward": request.form.get('xp_reward'),
    "start_time": request.form.get('start_time') or None,
    "end_time": request.form.get('end_time') or None,
    "repeat_days": request.form.getlist('repeat_days') or []
    }

    task_dict = dict(task)

    return jsonify({"status": "success", "message": "Task added!", "task": task_dict})

@tasks_bp.route("/getTaskDetails/<task_id>", methods=['POST'])
def getTaskDetails(task_id):
    tasks = get_tasks()

    wanted_task = None

    for task in tasks:
     if int(task['task_id']) == int(task_id):
         wanted_task = task

    if wanted_task:
        return jsonify({"status": "ok", "task": wanted_task})
    else:
        return jsonify({"status": "not found"})

@tasks_bp.route("/update_task/<task_id>", methods=['POST'])
def update_task(task_id):
    task_id = request.form.get('task_id')
    task_name = request.form.get('task_name')
    coin_reward = request.form.get('coin_reward')
    xp_reward = request.form.get('xp_reward')
    start_time = request.form.get('start_time')
    end_time = request.form.get('end_time')
    days = request.form.getlist('repeat_days')
    repeat_days = ",".join(days) if days else None

    if repeat_days:
     repeat_days_str = ",".join(repeat_days)
    else:
     repeat_days_str = None

    if start_time == "":
        start_time = None

    if end_time == "":
        end_time = None

    task = {
        "task_id": task_id,
        "task_name": task_name,
        "coin_reward": coin_reward,
        "xp_reward": xp_reward,
        "start_time": start_time,
        "end_time": end_time,
        "repeat_days": repeat_days_str
        }


    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()

    cursor.execute('''
    UPDATE tasks
    SET
        task_name = ?,
        coin_reward = ?,
        xp_reward = ?,
        start_time = ?,
        end_time = ?,
        repeat_days = ?
    WHERE
        user_id = ? AND id = ?
    ''', (task_name, coin_reward, xp_reward, start_time, end_time, repeat_days, user["id"], task_id))

    conn.commit()
    conn.close() 

    return jsonify({"status": "ok", "task": task})
