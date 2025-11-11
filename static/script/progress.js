let current_xp = currentXP;
let next_level_xp = nextLevelXP;

export function set_xp(current_xp, next_level_xp) {
  current_xp = current_xp;
  const progressBar = document.getElementById("progress_bar");
  const progressPercent = (current_xp / next_level_xp) * 100;
  progressBar.style.width = `${progressPercent}%`;

  document.getElementById("current_xp").innerHTML = current_xp;
}

export function add_xp(amount) {
  const progressBar = document.getElementById("progress_bar");
  let new_xp = current_xp + amount;
  current_xp = new_xp;
  const progressPercent = (new_xp / next_level_xp) * 100;
  progressBar.style.width = `${progressPercent}%`;
  document.getElementById("current_xp").innerHTML = new_xp;
}

export function remove_xp(amount) {
  const progressBar = document.getElementById("progress_bar");
  current_xp -= amount;
  if (current_xp < 0) current_xp = 0;

  const progressPercent = (current_xp / next_level_xp) * 100;
  progressBar.style.width = `${progressPercent}%`;
  document.getElementById("current_xp").innerHTML = current_xp;
}
