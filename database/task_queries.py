# this interacts with the db to get task

from database.db import get_connection 

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
        "repeat_days": row["repeat_days"]
    } for row in rows]
    cursor.close()
    conn.close()
    return tasks