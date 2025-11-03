function set_xp(amount, nextLevelXP) {
  const progressBar = document.getElementById("progress_bar");
  const progressPercent = (amount / nextLevelXP) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

export function add_xp(amount) {
  const progressBar = document.getElementById("progress_bar");
  const xpContainer = document.getElementById("current_xp");

  currentXP += amount;

  // Handle level up
  while (currentXP >= nextLevelXP) {
    currentXP -= nextLevelXP;
    currentLevel++;
    nextLevelXP = Math.floor(nextLevelXP * 1.2);
    document.getElementById("level_container").querySelector("h1").innerHTML =
      currentLevel;
  }

  // Handle level down
  while (currentXP < 0 && currentLevel > 1) {
    currentLevel--;
    nextLevelXP = Math.floor(nextLevelXP / 1.2);
    currentXP += nextLevelXP;
    document.getElementById("level_container").querySelector("h1").innerHTML =
      currentLevel;
  }

  if (currentXP < 0) currentXP = 0;

  xpContainer.innerHTML = currentXP;

  // Update progress bar
  const progressPercent = (currentXP / nextLevelXP) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

export function add_coins(amount) {
  const coinContainer = document.getElementById("coin_container");
  const h1 = coinContainer.querySelector("h1");

  current_coins += amount;
  h1.innerHTML = current_coins;
}

function load_user_data(level, xp, coins, xpNeeded, user_name) {
  if (user_name == "none") {
    console.warn("No user data found.");
    return;
  }

  document.getElementById("level_container").querySelector("h1").innerHTML =
    level;

  document.getElementById("coin_container").querySelector("h1").innerHTML =
    coins;

  document.getElementById("xp_needed").innerHTML = xpNeeded;

  document.getElementById("current_xp").innerHTML = xp;

  set_xp(currentXP, xpNeeded);

  document.getElementById("name").innerHTML = user_name;
}

document.addEventListener("DOMContentLoaded", () => {
  load_user_data(
    currentLevel,
    currentXP,
    current_coins,
    nextLevelXP,
    user_name
  );
});
