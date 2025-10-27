import { getTaskDetails } from "../api.js";
import { updateTaskFromDOM } from "../tasks/domTasks.js";

let current_task_id = null;

export async function show_window(task) {
  const wanted_task = (await getTaskDetails(task.id)).task;

  const form = document.getElementById("edit_task_form");

  form.querySelector('input[name="task_name"]').value =
    wanted_task.task_name || "";
  form.querySelector('input[name="coin_reward"]').value =
    wanted_task.coin_reward || 0;
  form.querySelector('input[name="xp_reward"]').value =
    wanted_task.xp_reward || 0;
  form.querySelector('input[name="start_time"]').value =
    wanted_task.start_time || "";
  form.querySelector('input[name="end_time"]').value =
    wanted_task.end_time || "";
  form.querySelector('input[name="task_id"]').value = wanted_task.task_id;

  current_task_id = wanted_task.task_id;

  // Checkboxes (repeat days)
  const checkboxes = form.querySelectorAll('input[name="repeat_days"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked =
      wanted_task.repeat_days?.includes(checkbox.value) || false;
  });

  switch_window("edit_task_window");
}

document
  .getElementById("edit_task_form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = `/update_task/${encodeURIComponent(current_task_id)}`;

    console.log(url);

    const formData = new FormData(e.target);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    let task = result["task"];

    updateTaskFromDOM(task);

    current_task_id = null;

    switch_window("system_container");
    e.target.reset();
  });
