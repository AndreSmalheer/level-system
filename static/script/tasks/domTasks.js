import { updateRewards } from "./taskRewards.js";
import { initTaskPopUps } from "./taskPopups.js";
import { initCheckboxes } from "./taskCheckboxes.js";

export function addTaskToDOM(task) {
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

    if (task.start_time) {
      const startTime = document.createElement("span");
      startTime.classList.add("start_time");
      startTime.textContent = task.start_time;
      timeContainer.appendChild(startTime);
    }

    if (task.end_time) {
      const endTime = document.createElement("span");
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

  // Add task div to container
  tasksContainer.appendChild(taskDiv);

  // Reinitialize functions
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

export function updateTaskFromDOM(task) {
  let taskID = task.task_id;
  const taskContainer = document.getElementById("tasks_container");

  const taskElement = taskContainer.querySelector(`.task[id="${taskID}"]`);

  if (!taskElement) {
    console.warn(`Task with ID ${taskID} not found in DOM.`);
    return;
  }

  console.log(task);

  if (taskElement) {
    taskElement.querySelector(".task_text").textContent = task.task_name;
    taskElement.querySelector(".start_time").textContent = task.start_time;
    taskElement.querySelector(".end_time").textContent = task.end_time;
    taskElement.querySelector(".coin_container h1").textContent =
      task.coin_reward;
    taskElement.querySelector(".xp_container h1").textContent = task.xp_reward;
  }
}
