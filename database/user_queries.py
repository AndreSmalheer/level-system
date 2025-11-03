# this interacts with the db to get users

from database.db import get_connection  

def change_user_name(user_id, new_name):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET name = ? WHERE id = ?", (new_name, user_id))
    conn.commit()
    cursor.close()
    conn.close()

def add_user(name):
    default_stats = {
        "level": 1,
        "coins": 0,
        "xp": 0,
        "xp_to_next_level": 100
    }

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (name) VALUES (?)", (name,))
    user_id = cursor.lastrowid
    cursor.execute(
        "INSERT INTO character_stats (user_id, level, coins, xp, xp_to_next_level) VALUES (?, ?, ?, ?, ?)",
        (user_id, default_stats["level"], default_stats["coins"], default_stats["xp"], default_stats["xp_to_next_level"])
    )
    conn.commit()
    cursor.close()
    conn.close()

    data = {
        "id": user_id,
        "name": name,
        **default_stats
    }
    return {"status": "success", "data": data}

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