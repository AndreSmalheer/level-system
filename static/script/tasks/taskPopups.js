import { switch_window } from "../system.js";
import { removeTaskFromDOM } from "./domTasks.js";

export function initTaskPopUps() {
  const tasks = document.querySelectorAll(".task");
  const popUp = document.querySelector(".task-pop-up");
  let activeTask = null;

  tasks.forEach((task) => {
    task.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      popUp.style.left = `${e.pageX}px`;
      popUp.style.top = `${e.pageY}px`;
      popUp.classList.add("active");
      activeTask = task;
    });
  });

  document.addEventListener("click", (e) => {
    if (!popUp.contains(e.target)) popUp.classList.remove("active");
  });

  popUp.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => {
      const action = li.textContent.trim();
      if (action === "Edit Task") {
        switch_window("edit_task_window");
      } else if (action === "Delete Task") {
        const taskName = activeTask
          .querySelector(".task_text")
          .textContent.trim();
        document.getElementById("delete_task_name").textContent = taskName;

        document.getElementById("confirm_delete_button").onclick = function () {
          console.log();
          removeTaskFromDOM(activeTask.id);
          removeTask(activeTask.id);
        };

        switch_window("delete_task_window");
      }
      popUp.classList.remove("active");
    });
  });
}

initTaskPopUps();
