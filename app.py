from flask import Flask, render_template
from database.user_queries import get_user
from database.task_queries import get_tasks
from routes.tasks import tasks_bp
from routes.user import user_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(tasks_bp)
app.register_blueprint(user_bp)

@app.route('/')
def home():
    user = get_user()
    tasks = get_tasks()
    return render_template('index.html', user=user, tasks=tasks)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
