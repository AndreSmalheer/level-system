import { add_coins, add_xp } from "../status.js";
import { setTaskStatus } from "../api.js";

function getTaskRewards(taskLabel) {
  const coinElement = taskLabel.querySelector(
    ".reward_container .coin_container h1"
  );
  const xpElement = taskLabel.querySelector(
    ".reward_container .xp_container h1"
  );

  return {
    coins: parseInt(coinElement.textContent, 10),
    xp: parseInt(xpElement.textContent, 10),
  };
}

export function updateRewards(taskLabel, isChecked) {
  const { coins, xp } = getTaskRewards(taskLabel);
  const factor = isChecked ? 1 : -1;

  add_coins(coins * factor);
  add_xp(xp * factor);

  const taskTextSpan = taskLabel.querySelector(".task_text");
  if (!taskTextSpan) return;

  setTaskStatus(taskTextSpan.textContent.trim(), isChecked);
}
