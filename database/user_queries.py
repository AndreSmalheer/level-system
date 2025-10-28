# this interacts with the db to get users

from database.db import get_connection  

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