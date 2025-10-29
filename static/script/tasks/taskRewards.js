import { add_coins, add_xp } from "../status.js";
import { setTaskStatus } from "../api.js";

function getTaskRewards(task_id) {
  const task_container = document.getElementById(task_id);
  const coinElement = task_container.querySelector(
    ".reward_container .coin_container h1"
  );

  const xpElement = task_container.querySelector(
    ".reward_container .xp_container h1"
  );

  return {
    coins: parseInt(coinElement.textContent, 10),
    xp: parseInt(xpElement.textContent, 10),
  };
}

export function updateRewards(task_id) {
  const task_container = document.getElementById(task_id);
  const checkbox = task_container.querySelector('input[type="checkbox"]');
  const isChecked = checkbox?.checked || false;

  const { coins, xp } = getTaskRewards(task_id);
  const factor = isChecked ? 1 : -1;

  add_coins(coins * factor);
  add_xp(xp * factor);

  const taskLabel = task_container.querySelector("label");
  const taskTextSpan = taskLabel?.querySelector(".task_text");
  if (!taskTextSpan) return;

  setTaskStatus(taskTextSpan.textContent.trim(), isChecked);
}
