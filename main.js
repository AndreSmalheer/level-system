const container = document.getElementById("system_container");
const sound = document.getElementById("openSound");
const msg = document.getElementById("activate_msg");

let currentXP = 0;
let nextLevelXP = 100;
let currentLevel = 1;
let current_coins = 0;

function activateSystem() {
  msg.style.opacity = 0;
  container.classList.add("active");
  sound.currentTime = 0;
  sound.play().catch(() => {});
  document.removeEventListener("click", activateSystem);
}

document.addEventListener("click", activateSystem);

function add_coins(amount) {
  const element = document.getElementById("coin_container");
  const h1 = element.querySelector("h1");

  let calc = current_coins + amount;

  current_coins = calc;
  h1.innerHTML = current_coins;
}

function add_xp(amount) {
  currentXP += amount;

  // Handle level up
  while (currentXP >= nextLevelXP) {
    currentXP -= nextLevelXP; // subtract XP needed for this level
    currentLevel++; // increase level
    nextLevelXP = Math.floor(nextLevelXP * 1.2); // scale next level XP
    document.getElementById("level_container").querySelector("h1").innerHTML =
      currentLevel;
  }

  // Handle level down
  while (currentXP < 0 && currentLevel > 1) {
    currentLevel--; // decrease level
    nextLevelXP = Math.floor(nextLevelXP / 1.2); // revert previous level's XP requirement
    currentXP += nextLevelXP; // carry XP from previous level
    document.getElementById("level_container").querySelector("h1").innerHTML =
      currentLevel;
  }

  // Prevent XP from going negative if at level 1
  if (currentXP < 0) currentXP = 0;

  // Update progress bar
  const progressPercent = (currentXP / nextLevelXP) * 100;
  const progressBar = document.getElementById("progress_bar");
  progressBar.style.width = `${progressPercent}%`;
}

function getTaskRewards(taskLabel) {
  const coinElement = taskLabel.querySelector(
    ".reward_container .coin_container h1"
  );
  const xpElement = taskLabel.querySelector(
    ".reward_container .xp_container h1"
  );

  const coins = parseInt(coinElement.textContent, 10);
  const xp = parseInt(xpElement.textContent, 10);

  return { coins, xp };
}

function updateRewards(taskLabel, isChecked) {
  const { coins, xp } = getTaskRewards(taskLabel);
  const factor = isChecked ? 1 : -1;

  add_coins(coins * factor);
  add_xp(xp * factor);
}

// Attach event listeners to all checkboxes
document.querySelectorAll(".task_checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    const taskLabel = event.target.closest(".task_label");
    if (!taskLabel) return;

    updateRewards(taskLabel, checkbox.checked);
  });
});
