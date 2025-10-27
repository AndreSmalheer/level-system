import { updateRewards } from "./taskRewards.js";
import { initTaskPopUps } from "./taskPopups.js";
import { initCheckboxes } from "./taskCheckboxes.js";

export function addTaskToDOM(task) {
  const tasksContainer = document.getElementById("tasks_container");

  // Create task wrapper
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");

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

  // Reward container
  const rewardContainer = document.createElement("div");
  rewardContainer.classList.add("reward_container");

  // Coin container
  const coinContainer = document.createElement("div");
  coinContainer.classList.add("coin_container");
  const coinIcon = document.createElement("img");
  coinIcon.classList.add("coin_icon");
  coinIcon.src = "/static/images/icons/coin.png"; // Adjust path if needed
  const coinAmount = document.createElement("h1");
  coinAmount.textContent = task.coin_reward;
  coinContainer.appendChild(coinIcon);
  coinContainer.appendChild(coinAmount);

  // XP container
  const xpContainer = document.createElement("div");
  xpContainer.classList.add("xp_container");
  const xpIcon = document.createElement("img");
  xpIcon.classList.add("coin_icon");
  xpIcon.src = "/static/images/icons/coin.png"; // Adjust path if needed
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

  initTaskPopUps();
  initCheckboxes();
}

export function removeTaskFromDOM(taskName) {
  console.log("🗑️ Attempting to remove task:", taskName);

  // Find all task elements
  const taskElements = document.querySelectorAll(".task");

  let found = false;

  taskElements.forEach((taskDiv) => {
    const span = taskDiv.querySelector(".task_text");
    if (span && span.textContent === taskName) {
      console.log("✅ Found matching task element:", taskDiv);
      taskDiv.remove();
      console.log("🚮 Task removed from DOM successfully.");
      found = true;
    }
  });

  if (!found) {
    console.warn("⚠️ Task not found in DOM:", taskName);
  }
}
