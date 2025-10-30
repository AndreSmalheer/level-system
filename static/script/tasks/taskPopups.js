import { switch_window } from "../system.js";
import { removeTaskFromDOM } from "./domTasks.js";
import { show_window } from "../windows/edit_task_window.js";

function handlePopUpAction(action, activeTask, popUp) {
  const rewardContainer = activeTask.querySelector(".reward_container");

  // Coin reward
  const coin = parseInt(
    rewardContainer.querySelector(".coin_container h1").textContent.trim(),
    10
  );

  // XP reward
  const xp = parseInt(
    rewardContainer.querySelector(".xp_container h1").textContent.trim(),
    10
  );

  if (coin < 0 && xp < 0) {
    console.log("task is punishment");
  }

  if (action === "Edit Task") {
    show_window(activeTask);
  } else if (action === "Delete Task") {
    const taskName = activeTask.querySelector(".task_text").textContent.trim();

    document.getElementById("delete_task_name").textContent = taskName;

    document.getElementById("confirm_delete_button").onclick = function () {
      removeTaskFromDOM(activeTask.id);
      removeTask(activeTask.id);
    };

    switch_window("delete_task_window");
  }

  popUp.classList.remove("active");
}

function updateTaskPopUp(popUp, task) {
  // Save original content if not already saved
  if (!popUp.dataset.original) {
    popUp.dataset.original = popUp.innerHTML;
  }

  // Check rewards to determine if it's a punishment
  const rewardContainer = task.querySelector(".reward_container");
  const coin = parseInt(
    rewardContainer.querySelector(".coin_container h1").textContent.trim(),
    10
  );
  const xp = parseInt(
    rewardContainer.querySelector(".xp_container h1").textContent.trim(),
    10
  );

  // If task failed or punishment, show "Unavailable"
  if (task.classList.contains("failed") || (coin < 0 && xp < 0)) {
    popUp.innerHTML = "<ul><li>Unavailable</li></ul>";
    return false; // indicate popup is unavailable
  }

  // Otherwise, restore original content
  popUp.innerHTML = popUp.dataset.original;
  return true; // indicate popup is available
}

export function initTaskPopUps() {
  const tasks = document.querySelectorAll(".task");
  const popUp = document.querySelector(".task-pop-up");
  let activeTask = null;

  tasks.forEach((task) => {
    task.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      activeTask = task;

      const isAvailable = updateTaskPopUp(popUp, task);

      popUp.style.left = `${e.pageX}px`;
      popUp.style.top = `${e.pageY}px`;
      popUp.classList.add("active");

      // Only attach click handlers if popup is available
      if (isAvailable) {
        popUp.querySelectorAll("li").forEach((li) => {
          li.addEventListener("click", () => {
            const action = li.textContent.trim();
            handlePopUpAction(action, activeTask, popUp);
          });
        });
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!popUp.contains(e.target)) popUp.classList.remove("active");
  });

  popUp.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => {
      const action = li.textContent.trim();
      handlePopUpAction(action, activeTask, popUp);
    });
  });
}

initTaskPopUps();
