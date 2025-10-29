import { updateRewards } from "./taskRewards.js";

export function initCheckboxes() {
  document.querySelectorAll(".task_checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const taskContainer = event.target.closest(".task");
      const task_id = taskContainer.id;

      if (!taskContainer) return;

      if (!task_id) return;

      if (taskContainer.classList.contains("failed")) {
        console.log(`Task failed for task ${taskContainer.id}`);
        return;
      }

      if (!taskContainer.classList.contains("failed")) {
        if (checkbox.checked) {
          taskContainer.classList.add("completed");
        } else {
          taskContainer.classList.remove("completed");
        }
      }
      updateRewards(task_id);
    });
  });
}

initCheckboxes();
