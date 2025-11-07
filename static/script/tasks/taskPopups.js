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

function handleConsequenceAction(action, activeConsequence, popUp) {
  return;
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

function updateConsequencePopUp(popUp, consequence) {
  // Save original content if not already saved
  if (!popUp.dataset.original) {
    popUp.dataset.original = popUp.innerHTML;
  }

  // Set popup content for consequences
  popUp.innerHTML = `
    <ul>
      <li>Edit Consequence</li>
      <li>Delete Consequence</li>
    </ul>
  `;

  return true;
}

function attachPopUpListeners(elements, popUp, updateFunction, handleFunction) {
  if (!popUp) {
    console.warn("Popup element not found for these elements:", elements);
    return; // stop here if popup not in DOM
  }

  let activeElement = null;

  elements.forEach((element) => {
    element.addEventListener("contextmenu", (e) => {
      console.log("Right click detected on element:", element);
      e.preventDefault();
      activeElement = element;

      let isAvailable = true;

      if (typeof updateFunction === "function") {
        isAvailable = updateFunction(popUp, element);
      }

      popUp.style.left = `${e.pageX}px`;
      popUp.style.top = `${e.pageY}px`;
      popUp.classList.add("active");

      if (isAvailable && typeof handleFunction === "function") {
        popUp.querySelectorAll("li").forEach((li) => {
          li.addEventListener("click", () => {
            const action = li.textContent.trim();
            handleFunction(action, activeElement, popUp);
          });
        });
      }
    });
  });

  // Only add global click listener if popup exists
  document.addEventListener("click", (e) => {
    if (popUp && !popUp.contains(e.target)) {
      popUp.classList.remove("active");
    }
  });
}

export function initTaskPopUps() {
  const tasks = document.querySelectorAll(".task");
  const popUp = document.querySelector(".task-pop-up");
  if (tasks.length && popUp)
    attachPopUpListeners(tasks, popUp, updateTaskPopUp, handlePopUpAction);
}

export function initConsequencePopUps() {
  const consequences = document.querySelectorAll(".consequence");
  const popUp = document.querySelector(".task-pop-up");
  attachPopUpListeners(
    consequences,
    popUp,
    updateConsequencePopUp,
    handleConsequenceAction
  );
}

initTaskPopUps();
initConsequencePopUps();
