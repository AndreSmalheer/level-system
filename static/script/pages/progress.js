let current_xp = currentUser.xp;
let nextLevelXP = currentUser.xpToNextLevel;

export function set_xp(current_xp, next_level_xp) {
  current_xp = current_xp;
  const progressBar = document.getElementById("progress_bar");
  const progressPercent = (current_xp / next_level_xp) * 100;
  progressBar.style.width = `${progressPercent}%`;

  document.getElementById("current_xp").innerHTML = current_xp;
}

export function add_xp(amount) {
  const progressBar = document.getElementById("progress_bar");
  current_xp += amount;

  while (current_xp >= nextLevelXP) {
    current_xp -= nextLevelXP;
    currentLevel++;
    nextLevelXP = Math.round(nextLevelXP * 1.2);

    document.querySelector("#level_container h1").innerHTML = currentLevel;
    document.getElementById("xp_needed").innerHTML = nextLevelXP;
  }

  const progressPercent = (current_xp / nextLevelXP) * 100;
  progressBar.style.width = `${progressPercent}%`;
  document.getElementById("current_xp").innerHTML = current_xp;
}

export function remove_xp(amount) {
  const progressBar = document.getElementById("progress_bar");
  current_xp -= amount;

  while (current_xp < 0 && currentLevel > 1) {
    currentLevel--;
    nextLevelXP = Math.round(nextLevelXP / 1.2);
    current_xp += nextLevelXP;

    document.querySelector("#level_container h1").innerHTML = currentLevel;
    document.getElementById("xp_needed").innerHTML = nextLevelXP;
  }

  if (current_xp < 0) current_xp = 0;

  const progressPercent = (current_xp / nextLevelXP) * 100;
  progressBar.style.width = `${progressPercent}%`;
  document.getElementById("current_xp").innerHTML = current_xp;
}
