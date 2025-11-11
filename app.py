from flask import Flask, render_template, request, jsonify
import sqlite3
import os

def get_connection():
    db_path = os.path.abspath("data.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def get_user():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users LIMIT 1")
    user_row = cursor.fetchone()
    if not user_row:
        conn.close()
        return None

    user_id = user_row['id']
    name = user_row['name']
    cursor.execute("SELECT * FROM character_stats WHERE user_id = ?", (user_id,))
    stats = cursor.fetchone()
    cursor.close()
    conn.close()

    if not stats:
        return None

    return {
        "id": user_id,
        "name": name,
        "level": stats["level"],
        "coins": stats["coins"],
        "xp": stats["xp"],
        "xp_to_next_level": stats["xp_to_next_level"]
    }

app = Flask(__name__)

@app.route('/')
def home(): 
    user = get_user()
    return render_template('index.html', tasks =[], user=user)


@app.route("/api/add", methods=["POST"])
def add_item():
    data_type = request.form.get("type")

    print(f"Adding new item of type: {data_type}")

    conn = get_connection()
    cursor = conn.cursor()

    if data_type == "add_user":
        name = request.form.get("user_name")
    
        # Insert user
        cursor.execute("INSERT INTO users (name) VALUES (?)", (name,))
        user_id = cursor.lastrowid
    
        # Insert default stats
        cursor.execute(
            "INSERT INTO character_stats (user_id, level, coins, xp, xp_to_next_level) VALUES (?, ?, ?, ?, ?)",
            (user_id, 1, 0, 0, 100)
        )
    
        conn.commit()
        cursor.close()
        conn.close()
    
        return {
            "status": "success",
            "data": {
                "id": user_id,
                "name": name,
                "level": 1,
                "coins": 0,
                "xp": 0,
                "xp_to_next_level": 100
            }
        }
    
    if data_type == "add_task":
        user = get_user()
        user_id = user["id"]

        task_name = request.form.get('task_name')
        coin_reward = request.form.get('coin_reward')
        xp_reward = request.form.get('xp_reward')
        start_time = request.form.get('start_time') or None
        end_time = request.form.get('end_time') or None
        repeat_days = request.form.getlist('repeat_days') or []
        repeat_days_str = ",".join(repeat_days) if repeat_days else None

        cursor.execute('''
        INSERT INTO tasks (user_id, task_name, coin_reward, xp_reward, start_time, end_time, repeat_days)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, task_name, coin_reward, xp_reward, start_time, end_time, repeat_days_str))
        task_id = cursor.lastrowid
        conn.commit()
        cursor.close()

        task_dict = {
        "task_id": task_id,
        "task_name": task_name,
        "coin_reward": coin_reward,
        "xp_reward": xp_reward,
        "start_time": start_time,
        "end_time": end_time,
        "repeat_days": repeat_days
        }

        return jsonify({"status": "success", "message": "Task added!", "task": task_dict})

    return jsonify({"status": "Failed", "message": "Data type does not match"})

@app.route("/api/update", methods=["GET"])
def update_item():
    data_type = request.form.get("type")

    if data_type == "update_task":
        pass

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
