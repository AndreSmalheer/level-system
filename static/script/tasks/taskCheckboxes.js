import { updateRewards } from "./taskRewards.js";

export function initCheckboxes() {
  document.querySelectorAll(".task_checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const taskLabel = event.target.closest(".task_label");
      if (!taskLabel) return;

      const task = taskLabel.closest(".task");
      if (!task.classList.contains("failed")) {
        if (checkbox.checked) {
          task.classList.add("completed");
        } else {
          task.classList.remove("completed");
        }
      }

      updateRewards(taskLabel, checkbox.checked);
    });
  });
}

initCheckboxes();
