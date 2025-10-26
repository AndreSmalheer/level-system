function set_xp(amount) {
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

set_xp(currentXP);
