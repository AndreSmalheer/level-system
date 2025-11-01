import { updateRewards } from "./taskRewards.js";
import { initTaskPopUps } from "./taskPopups.js";
import { initCheckboxes } from "./taskCheckboxes.js";
import { markTaskAsFailed } from "../api.js";

export async function addTaskToDOM(task) {
  const tasksContainer = document.getElementById("tasks_container");

  // Create task wrapper
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  taskDiv.id = task.task_id;

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

    const now = new Date();
    const currentHour = now.getHours();
    const currentMn = now.getMinutes();
    const currentTime = currentHour * 60 + currentMn;

    if (task.start_time) {
      const startTime = document.createElement("span");
      startTime.textContent = task.start_time;

      const [startHourStr, startMnStr] = task.start_time.split(":");
      const startMnTotal = parseInt(startHourStr) * 60 + parseInt(startMnStr);

      if (startMnTotal < currentTime) {
        startTime.classList.add("start_time");
        timeContainer.appendChild(startTime);
      } else {
        return;
      }
    }

    if (task.end_time) {
      const endTime = document.createElement("span");
      endTime.textContent = task.end_time;
      const [endHourStr, endMnStr] = task.end_time.split(":");
      const endMnTotal = parseInt(endHourStr) * 60 + parseInt(endMnStr);

      if (endMnTotal < currentTime) {
        taskDiv.classList.add("failed");
        // console.log(task.penelty_id);
        if (!task.completed && task.penelty_id == null) {
          let data = await markTaskAsFailed(task.task_id);
        }
      }

      endTime.classList.add("end_time");
      endTime.textContent = task.end_time;
      timeContainer.appendChild(endTime);
    }

    // Add time container before reward container
    label.appendChild(timeContainer);
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

  // Assemble reward container
  rewardContainer.appendChild(coinContainer);
  rewardContainer.appendChild(xpContainer);

  // Assemble label
  label.appendChild(checkbox);
  label.appendChild(span);
  label.appendChild(rewardContainer);

  // Add label to task div
  taskDiv.appendChild(label);

  let repeat_days = task.repeat_days || [];

  console.log(repeat_days);

  if (repeat_days.length > 0) {
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    if (repeat_days.includes(today)) {
      // Add task div to container
      tasksContainer.appendChild(taskDiv);

      // Reinitialize functions
      initTaskPopUps();
      initCheckboxes();
    }
  } else if (repeat_days.length === 0) {
    tasksContainer.appendChild(taskDiv);

    // Reinitialize functions
    initTaskPopUps();
    initCheckboxes();
  }
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
  let taskID = task.task_id;
  const taskContainer = document.getElementById("tasks_container");

  const taskElement = taskContainer.querySelector(`.task[id="${taskID}"]`);

  if (!taskElement) {
    console.warn(`Task with ID ${taskID} not found in DOM.`);
    return;
  }

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  let repeat_days = task.repeat_days || [];

  if (repeat_days.length > 0) {
    if (!repeat_days.includes(today)) {
      taskElement.style.display = "none";
    }
  }

  if (task.start_time || task.end_time) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMn = now.getMinutes();
    const currentTime = currentHour * 60 + currentMn;

    if (task.start_time) {
      const start_time = task.start_time;
      const [startHourStr, startMnStr] = start_time.split(":");

      const startMnTotal = parseInt(startHourStr) * 60 + parseInt(startMnStr);

      if (!startMnTotal < currentTime) {
        taskElement.style.display = "none";
        return;
      }
    }

    if (task.end_time) {
      const end_time = task.end_time;

      const [endHourStr, endMnStr] = end_time.split(":");

      const endMnTotal = parseInt(endHourStr) * 60 + parseInt(endMnStr);

      if (endMnTotal < currentTime) {
        if (!task.completed && task.penelty_id == null) {
          let data = await markTaskAsFailed(task.task_id);

          taskContainer
            .querySelector(`.task[id="${taskID}"]`)
            .classList.add("failed");
        }
      }
    }
  }

  const startTimeElem = taskElement.querySelector(".start_time");
  const endTimeElem = taskElement.querySelector(".end_time");

  if (taskElement) {
    taskElement.querySelector(".task_text").textContent = task.task_name;

    if (startTimeElem) {
      startTimeElem.textContent = task.start_time;
    }

    if (endTimeElem) {
      endTimeElem.textContent = task.end_time;
    }

    taskElement.querySelector(".coin_container h1").textContent =
      task.coin_reward;
    taskElement.querySelector(".xp_container h1").textContent = task.xp_reward;
  }
}

for (const task of tasks) {
  addTaskToDOM(task);
}
