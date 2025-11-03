import { updateRewards } from "./taskRewards.js";
import { initTaskPopUps } from "./taskPopups.js";
import { initCheckboxes } from "./taskCheckboxes.js";
import { markTaskAsFailed } from "../api.js";

export function shouldDisplayTask(task) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  // Check repeat days
  const repeatDays = task.repeat_days || [];
  const today = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  if (repeatDays.length > 0 && !repeatDays.includes(today)) {
    return false;
  }

  // Check start time
  // if (task.start_time) {
  //   const [startHourStr, startMinuteStr] = task.start_time.split(":");
  //   const startTimeTotal =
  //     parseInt(startHourStr) * 60 + parseInt(startMinuteStr);
  //   if (currentTime < startTimeTotal) {
  //     return false;
  //   }
  // }

  // Check end time
  // if (task.end_time) {
  //   const [endHourStr, endMinuteStr] = task.end_time.split(":");
  //   const endTimeTotal = parseInt(endHourStr) * 60 + parseInt(endMinuteStr);
  //   if (currentTime > endTimeTotal) {
  //     return false;
  //   }
  // }

  return true;
}

export async function addTaskToDOM(task) {
  // Only display the task if it passes the shouldDisplayTask check
  if (!shouldDisplayTask(task)) return;

  const tasksContainer = document.getElementById("tasks_container");

  // Create task wrapper
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  taskDiv.id = task.task_id;

  let task_completed = task.completed || false;
  if (task_completed) {
    taskDiv.classList.add("completed");
  }

  // Create label
  const label = document.createElement("label");
  label.classList.add("task_label");

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task_checkbox");
  if (task.completed) checkbox.checked = true;

  // Task name
  const span = document.createElement("span");
  span.classList.add("task_text");
  span.textContent = task.task_name;

  // Time container (only if start or end time exists)
  if (task.start_time || task.end_time) {
    const timeContainer = document.createElement("div");
    timeContainer.classList.add("time_container");

    if (task.start_time) {
      const startTime = document.createElement("span");
      startTime.textContent = task.start_time;
      const [startHourStr, startMinuteStr] = startTime.textContent.split(":");

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      const startTimeTotal = parseInt(startHourStr) * 60 + parseInt(startMinuteStr);

      startTime.classList.add("start_time");
      timeContainer.appendChild(startTime);

      if (startTimeTotal > currentTime) {
        taskDiv.classList.add("scheduled");
      }
    }

    if (task.end_time) {
      const endTime = document.createElement("span");
      endTime.textContent = task.end_time;
      endTime.classList.add("end_time");

      // Mark failed if the end time has passed and task is not completed
      const now = new Date();
      const [endHourStr, endMinuteStr] = task.end_time.split(":");
      const endTimeTotal = parseInt(endHourStr) * 60 + parseInt(endMinuteStr);
      const currentTime = now.getHours() * 60 + now.getMinutes();

      if (endTimeTotal < currentTime) {
        taskDiv.classList.add("failed");
        if (!task.completed && task.penelty_id == null) {
          await markTaskAsFailed(task.task_id);
        }
      }

      timeContainer.appendChild(endTime);
    }

    label.appendChild(timeContainer);
  }

  // mar failed if task failed if value if failed
  if (task.failed) {
    taskDiv.classList.add("failed");
  }

  // Reward container
  const rewardContainer = document.createElement("div");
  rewardContainer.classList.add("reward_container");

  // Coin container
  const coinContainer = document.createElement("div");
  coinContainer.classList.add("coin_container");
  const coinIcon = document.createElement("img");
  coinIcon.classList.add("coin_icon");
  coinIcon.src = "/static/images/icons/coin.png";
  const coinAmount = document.createElement("h1");
  coinAmount.textContent = task.coin_reward;
  coinContainer.appendChild(coinIcon);
  coinContainer.appendChild(coinAmount);

  // XP container
  const xpContainer = document.createElement("div");
  xpContainer.classList.add("xp_container");
  const xpIcon = document.createElement("img");
  xpIcon.classList.add("coin_icon");
  xpIcon.src = "/static/images/icons/coin.png";
  const xpAmount = document.createElement("h1");
  xpAmount.textContent = task.xp_reward;
  xpContainer.appendChild(xpIcon);
  xpContainer.appendChild(xpAmount);

  rewardContainer.appendChild(coinContainer);
  rewardContainer.appendChild(xpContainer);

  // Assemble label
  label.appendChild(checkbox);
  label.appendChild(span);
  label.appendChild(rewardContainer);

  // Add label to task div
  taskDiv.appendChild(label);

  // Add task to DOM
  tasksContainer.appendChild(taskDiv);

  // Reinitialize UI functions
  initTaskPopUps();
  initCheckboxes();
}

export function removeTaskFromDOM(taskID) {
  // Find all task elements
  const taskElements = document.querySelectorAll(".task");

  let found = false;

  taskElements.forEach((taskDiv) => {
    if (taskDiv.id == taskID) {
      taskDiv.remove();
      found = true;
    }
  });

  if (!found) {
    console.warn("⚠️ Task not found in DOM:", taskID);
  }
}

export async function updateTaskFromDOM(task) {
  const taskID = task.task_id;
  const taskContainer = document.getElementById("tasks_container");
  const taskElement = taskContainer.querySelector(`.task[id="${taskID}"]`);

  if (!taskElement) {
    console.warn(`Task with ID ${taskID} not found in DOM.`);
    return;
  }

  // Determine if the task should be displayed
  const display = shouldDisplayTask(task);
  taskElement.style.display = display ? "block" : "none";

  // Check if task has failed
  if (task.end_time) {
    const now = new Date();
    const [endHourStr, endMinuteStr] = task.end_time.split(":");
    const endTimeTotal = parseInt(endHourStr) * 60 + parseInt(endMinuteStr);
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (
      currentTime > endTimeTotal &&
      !task.completed &&
      task.penelty_id == null
    ) {
      await markTaskAsFailed(task.task_id);
      taskElement.classList.add("failed");
    }
  }

  // Update task content
  taskElement.querySelector(".task_text").textContent = task.task_name;

  const startTimeElem = taskElement.querySelector(".start_time");
  if (startTimeElem) startTimeElem.textContent = task.start_time;

  const endTimeElem = taskElement.querySelector(".end_time");
  if (endTimeElem) endTimeElem.textContent = task.end_time;

  taskElement.querySelector(".coin_container h1").textContent =
    task.coin_reward;
  taskElement.querySelector(".xp_container h1").textContent = task.xp_reward;
}

export function clearAllTasksFromDOM() {
  const tasksContainer = document.getElementById("tasks_container");
  tasksContainer.innerHTML = "";
}

export function resetTaskDOM(taskID) {
  const taskElement = document.getElementById(taskID);
  if (!taskElement) return;

  taskElement.classList.remove("failed", "completed");
  const checkbox = taskElement.querySelector(".task_checkbox");
  if (checkbox) checkbox.checked = false;
}

for (const task of tasks) {
  addTaskToDOM(task);
}
