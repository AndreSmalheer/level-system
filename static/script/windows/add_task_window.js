import { addTaskToDOM } from "../tasks/domTasks.js";
import { switch_window } from "../system.js";

document
  .getElementById("add_task_form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const response = await fetch("/add_task", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    addTaskToDOM(result.task);

    // Close popup and reset form
    switch_window("system_container");
    e.target.reset();
  });
