from app import get_tasks
from datetime import datetime, timedelta
import requests

def update_task(task_id, task_name, coin_reward, xp_reward, start_time, end_time, completed, failed, repeat_days):
    print("Updating task with the following data:")
    print(f"  task_id: {task_id}")
    print(f"  task_name: {task_name}")
    print(f"  coin_reward: {coin_reward}")
    print(f"  xp_reward: {xp_reward}")
    print(f"  start_time: {start_time}")
    print(f"  end_time: {end_time}")
    print(f"  completed: {completed}")
    print(f"  failed: {failed}")
    print(f"  repeat_days: {repeat_days}")
    # url = "http://127.0.0.1:5000/api/update"  
    
    # data = {
    #     "type": "update_task",
    #     "task_id": task_id,
    #     "task_name": task_name,
    #     "coin_reward": coin_reward,
    #     "xp_reward": xp_reward,
    #     "start_time": start_time,
    #     "end_time": end_time,
    #     "completed": completed,
    #     "failed": failed,
    #     "repeat_days": repeat_days
    # }
    
    # response = requests.post(url, json=data)
    # print(response.status_code, response.json())

# tasks = get_tasks()
tasks = [
    # ---------------------------
    # 1. FAILED TASKS
    # ---------------------------
    {"task_name": "Failed task repeating today", "failed": True, "completed": False, "repeat_days": ["Saturday", "Sunday"]},
    {"task_name": "Failed task not repeating today", "failed": True, "completed": False, "repeat_days": ["Monday", "Wednesday"]},

    # ---------------------------
    # 2. COMPLETED TASKS
    # ---------------------------
    {"task_name": "Completed task repeating today", "failed": False, "completed": True, "repeat_days": ["Saturday", "Sunday"]},
    {"task_name": "Completed task not repeating today", "failed": False, "completed": True, "repeat_days": ["Monday", "Wednesday"]},
    {"task_name": "Completed task with no repeat", "failed": False, "completed": True, "repeat_days": None},

    # ---------------------------
    # 3. SCHEDULED TODAY
    # ---------------------------
    {"task_name": "Scheduled today, not yesterday", "failed": False, "completed": False, "repeat_days": ["Saturday", "Sunday"]},
    {"task_name": "Scheduled today and yesterday (missed yesterday)", "failed": False, "completed": False, "repeat_days": ["Friday", "Saturday"]},

    # ---------------------------
    # 4. SCHEDULED YESTERDAY BUT NOT TODAY (missed yesterday)
    # ---------------------------
    {"task_name": "Missed yesterday, not today", "failed": False, "completed": False, "repeat_days": ["Friday"]},

    # ---------------------------
    # 5. PENDING TASKS NOT SCHEDULED TODAY
    # ---------------------------
    {"task_name": "Pending task not scheduled today", "failed": False, "completed": False, "repeat_days": ["Monday", "Wednesday"]},

    # ---------------------------
    # 6. EDGE CASE: Completed yesterday but scheduled today
    # ---------------------------
    {"task_name": "Completed yesterday, scheduled today", "failed": False, "completed": True, "repeat_days": ["Friday", "Saturday"]},
    {"task_name": "Completed yesterday, scheduled today no repeat today", "failed": False, "completed": True, "repeat_days": ["Friday"]},
]


today = datetime.today().strftime("%A")
yesterday = (datetime.today() - timedelta(days=1)).strftime("%A")

for task in tasks:
    failed = task['failed']
    completed = task['completed']
    repeat_days = task['repeat_days']

    # ---------------------------
    # 1. FAILED TASKS
    # ---------------------------
    if failed:
        if today in repeat_days:
            print(f"[FAILED + REPEAT] Task '{task['task_name']}' is failed but repeats today → doing nothing with first task and scheduling new task for tomorrow")
            continue  # skip to next task
        else:
            print(f"[FAILED] Task '{task['task_name']}' is failed and does not repeat today → skipping this task")
            continue

    # ---------------------------
    # 2. COMPLETED TASKS
    # ---------------------------
    if completed:
        if repeat_days:
            if today in repeat_days:
                print(f"[COMPLETED + REPEAT] Task '{task['task_name']}' completed but scheduled for today → resetting completed and failed status")
                continue
            else:
                print(f"[COMPLETED + NOT TODAY] Task '{task['task_name']}' is completed but not scheduled for today → hiding task and reseting completed and failed")
                continue
        else:
            print(f"[COMPLETED] Task '{task['task_name']}' completed and not repeating today → removing/ignoring task")
            continue

    # ---------------------------
    # 3. TASKS THAT SHOULD RUN TODAY OR WERE MISSED YESTERDAY
    # ---------------------------
    if today in repeat_days:
        if yesterday in repeat_days:
            print(f"[MISSED YESTERDAY] Task '{task['task_name']}' was scheduled yesterday and today → marking as failed and adding new task")
        else:
            print(f"[SCHEDULED TODAY] Task '{task['task_name']}' is scheduled today → adding as normal task")
        continue
    elif yesterday in repeat_days:
        # Task was scheduled yesterday but today is NOT a repeat day
        print(f"[MISSED YESTERDAY] Task '{task['task_name']}' was scheduled yesterday but not today → marking as failed (no new task created)")
        continue

    # ---------------------------
    # 4. PENDING TASKS NOT SCHEDULED TODAY
    # ---------------------------
    print(f"[PENDING] Task '{task['task_name']}' not completed, not failed, and not scheduled today → marking as failed")
