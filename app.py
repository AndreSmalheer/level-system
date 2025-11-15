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

def get_tasks():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks")
    rows = cursor.fetchall()
    tasks = [{
        "task_id": row["id"],
        "task_name": row["task_name"],
        "coin_reward": row["coin_reward"],
        "xp_reward": row["xp_reward"],
        "start_time": row["start_time"],
        "end_time": row["end_time"],
        "completed": bool(row["completed"]),
        "failed": bool(row['failed']),
        "penelty_id": (row['penelty_id']),
        "repeat_days": row["repeat_days"]
    } for row in rows]
    cursor.close()
    conn.close()
    return tasks

def get_concecenses():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM concecenses")
    rows = cursor.fetchall()
    concecenses = [{
        "concecenses_id": row["concecenses_id"],
        "name": row["name"],
        "description": row["description"],
    } for row in rows]
    cursor.close()
    conn.close()
    return concecenses

app = Flask(__name__)

@app.route('/')
def home(): 
    user = get_user()
    tasks = get_tasks()
    concecenses = get_concecenses()
    return render_template('index.html', tasks = tasks, user=user, concecenses = concecenses)

@app.route("/api/add", methods=["POST"])
def add_item():
    data = request.get_json(silent=True) or request.form
    data_type = data.get("type")

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
       data = request.get_json(silent=True) or request.form

       user = get_user()
       user_id = user["id"]

       task_name = data.get("task_name")
       coin_reward = data.get("coin_reward")
       xp_reward = data.get("xp_reward")
       start_time = data.get("start_time") or None
       end_time = data.get("end_time") or None

       # Handle repeat_days properly for both JSON and form
       if isinstance(data.get("repeat_days"), list):
           repeat_days = data.get("repeat_days")
       else:
           repeat_days = request.form.getlist("repeat_days") or []
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

    if data_type == "add_concecense":
       data = request.get_json(silent=True) or request.form

       concecenses_name = data.get("concecenses_name")
       concecenses_description = data.get("concecenses_description")

       cursor = conn.cursor()
       cursor.execute('''
           INSERT INTO concecenses (name, description)
           VALUES (?, ?)
       ''', (concecenses_name, concecenses_description))
       
       concecenses_id = cursor.lastrowid 
       conn.commit()
       cursor.close()

       concecenses_dict = {
         "concecenses_id": concecenses_id,
         "name": concecenses_name,
         "description": concecenses_description
       }

       return jsonify({"status": "success", "message": "concecenses added!", "concecenses": concecenses_dict})

    return jsonify({"status": "Failed", "message": "Data type does not match"})

@app.route("/api/remvoe", methods=["POST"])
def remove_item():
    data_type = request.json.get("type") 

    if data_type == "remove_task":
        task_id = request.json.get("task_id")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))

        conn.commit()
        conn.close()

        return jsonify({"message": "Task removed"}), 200
    
    return jsonify({"status": "Failed", "message": "Data type does not match"})

@app.route("/api/update", methods=["POST"])
def update_item():
    data_type = request.json.get("type") 

    if data_type == "update_task":
        task_id = request.json.get("task_id")
        name = request.json.get("task_name")
        coin_reward = request.json.get("coin_reward")
        xp_reward = request.json.get("xp_reward")
        start_time = request.json.get("start_time")
        end_time = request.json.get("end_time")
        completed = request.json.get("completed")
        failed = request.json.get("failed")
        repeat_days = request.json.get("repeat_days")
        repeat_days_string = ",".join(repeat_days) if repeat_days else None

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
        UPDATE tasks
        SET task_name = ?, coin_reward = ?, xp_reward = ?, start_time = ?, end_time = ?,
            completed = ?, failed = ?, repeat_days = ?
        WHERE id = ?
        ''', (name, coin_reward, xp_reward, start_time, end_time, completed, failed, repeat_days_string, task_id))

        conn.commit()
        conn.close()

        return jsonify({"message": "Task updated"}), 200

    if data_type == "update_concecenses":
        id = request.json.get("id")
        name = request.json.get("name")
        description = request.json.get("description")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
        UPDATE concecenses
        SET name = ?, description = ?
        WHERE concecenses_id = ?
        ''', (name, description, id))

        conn.commit()
        conn.close()

        return jsonify({"message": "concecense updated"}), 200

    if data_type == "update_user_stats":
        user_id = request.json.get("user_id")
        level = request.json.get("level")
        coins = request.json.get("coins")
        xp = request.json.get("xp")
        xp_to_next_level = request.json.get("xp_to_next_level")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
        UPDATE character_stats
        SET level = ?, coins = ?, xp = ?, xp_to_next_level = ?
        WHERE user_id = ?
        ''', (level, coins, xp, xp_to_next_level, user_id))

        conn.commit()
        conn.close()

        return jsonify({"message": "User stats updated"}), 200
    
    if data_type == "update_user_settings":
        new_user_name = request.json.get("user_name")
        user_id = request.json.get("user_id")

        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE users
            SET name = ?
            WHERE id = ?
        ''', (new_user_name, user_id))

        conn.commit()
        conn.close()

        return jsonify({"message": "user settings updated"}), 200

    return jsonify({"status": "Failed", "message": "Data type does not match"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
