from flask import Flask, render_template
from database.user_queries import get_user
from database.task_queries import get_tasks, mark_task_failed, delete_task_from_db
from routes.tasks import delete_task
from routes.tasks import tasks_bp
from routes.user import user_bp
from flask_apscheduler import APScheduler
from datetime import datetime

app = Flask(__name__)
scheduler = APScheduler()

def reset_tasks():
    tasks = get_tasks()

    for task  in tasks:
        repeat_days = task['repeat_days']

        if repeat_days:
            print("task has repeat days")

        else:
            completed = task['completed']
            failed = task['failed']

            if completed:
             delete_task_from_db(task['task_id'])
            else:
                if not failed:
                    mark_task_failed(task['task_id'])

 

# def daily_task():
#     print(f"Task running at {datetime.now()}")


# scheduler.add_job(
#     id='daily_task',
#     func=daily_task,
#     trigger='cron',
#     hour=7,
#     minute=1
# )

# scheduler.init_app(app)
# scheduler.start()

# Register blueprints
app.register_blueprint(tasks_bp)
app.register_blueprint(user_bp)

@app.route('/')
def home():
    user = get_user()
    tasks = get_tasks()
    return render_template('index.html', user=user, tasks=tasks)

if __name__ == '__main__':
    reset_tasks()
    app.run(host="0.0.0.0", port=5000, debug=True)

    
