# this interacts with the db to get task

from database.db import get_connection 
from datetime import datetime

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
        "repeat_days": row["repeat_days"]
    } for row in rows]
    cursor.close()
    conn.close()
    return tasks

def get_today_repeating_tasks():
    tasks = get_tasks()

    today_tasks = []

    current_day = datetime.now().strftime("%A").lower()

    for task in tasks:
        task_failed = task['failed']

        if task_failed:
         today_tasks.append(task)
        else: 
         repeat_days = task['repeat_days']
 
         if repeat_days != None:
             if current_day in repeat_days:
              today_tasks.append(task)
         else:   
             today_tasks.append(task)

    return today_tasks 

def delete_task_from_db(task_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()

def mark_task_failed(task_id):
    conn = get_connection()
    cursor = conn.cursor()

    # cursor.execute("UPDATE tasks SET failed = 1 WHERE id = ?", (task_id,))

    # get random punisment
    cursor.execute("SELECT penalty_id, name, description FROM penalties ORDER BY RANDOM() LIMIT 1")
    penalty = cursor.fetchone()

    if penalty:
     penalty_id, penalty_name, penalty_description = penalty

     cursor.execute("""UPDATE tasks SET failed = 1, penelty_id = ? WHERE id = ?""", (penalty_id, task_id))
     
    conn.commit()
    conn.close()