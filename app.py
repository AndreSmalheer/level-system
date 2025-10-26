# app.py
from flask import Flask, render_template, jsonify, request
import sqlite3
from urllib.parse import unquote

app = Flask(__name__)

def get_tasks():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row  # This allows us to access columns by name
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks")
    rows = cursor.fetchall()

    # Convert each row to a dictionary
    tasks = []
    for row in rows:
        task = {
            "task_name": row["task_name"],
            "coin_reward": row["coin_reward"],
            "xp_reward": row["xp_reward"],
            "start_time": row["start_time"],
            "end_time": row["end_time"],
            "completed": bool(row["completed"])
        }
        tasks.append(task)

    cursor.close()
    conn.close()
    return tasks

def get_user():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row  # Access columns by name
    cursor = conn.cursor()

    # Fetch the first user (or modify to fetch a specific user)
    cursor.execute("SELECT * FROM users LIMIT 1")
    user_row = cursor.fetchone()
    if not user_row:
        cursor.close()
        conn.close()
        return None 

    user_id = user_row['id']
    name = user_row['name']

    # Fetch the character stats for that user
    cursor.execute("SELECT * FROM character_stats WHERE user_id = ?", (user_id,))
    stats_row = cursor.fetchone()
    if not stats_row:
        cursor.close()
        conn.close()
        return None  # No stats found

    user = {
        "id": user_id,
        "name": name,
        "level": stats_row["level"],
        "coins": stats_row["coins"],
        "xp": stats_row["xp"],
        "xp_to_next_level": stats_row["xp_to_next_level"]
    }

    cursor.close()
    conn.close()

    return user


user = get_user()

@app.route("/completed_task/<name>", methods=["POST"])
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


@app.route("/uncomplete_task/<name>", methods=["POST"])
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


@app.route('/add_task', methods=['POST'])
def add_task():
    task_name = request.form.get('task_name')
    coin_reward = request.form.get('coin_reward')
    xp_reward = request.form.get('xp_reward')
    start_time = request.form.get('start_time')
    end_time = request.form.get('end_time')

    if start_time == "":
        start_time = "NULL"

    if end_time == "":
        end_time = "NULL"

    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()

    # Insert the data
    cursor.execute('''
     INSERT INTO tasks (user_id, task_name, coin_reward, xp_reward, start_time, end_time)
     VALUES (?, ?, ?, ?, ?, ?)
    ''', (user["id"], task_name, coin_reward, xp_reward, start_time, end_time))

    conn.commit()
    conn.close()    

    return jsonify({"status": "success", "message": "Task added!"})

@app.route('/')
def home():
    tasks = get_tasks()

    return render_template('index.html', user=user, tasks=tasks)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)