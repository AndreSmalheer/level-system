import { updateRewards } from "./taskRewards.js";

function initCheckboxes() {
  document.querySelectorAll(".task_checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const taskLabel = event.target.closest(".task_label");
      if (!taskLabel) return;
      updateRewards(taskLabel, checkbox.checked);
    });
  });
}

initCheckboxes();
