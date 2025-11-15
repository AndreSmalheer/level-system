import { Task, Concecenses } from "../modules/tasks.js";
import { switch_to_main_window } from "../modules/system_windows.js";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (form.id === "add_user_form") {
        await handleUserForm(form);
      } else if (form.id === "add_task_form") {
        await handleTaskForm(form);
      } else if (form.id === "add_concecenses_form") {
        await handleConcecensesForm(form);
      }
    });
  });
});

async function handleUserForm(form) {
  const formData = new FormData(form);
  const response = await fetch("/api/add", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  console.log("User form result:", result);
  switch_to_main_window();
  location.reload();
}

async function handleTaskForm(form) {
  const task_name = document.getElementById("task_name").value;
  const coin_reward = parseInt(document.getElementById("coin_reward").value);
  const xp_reward = parseInt(document.getElementById("xp_reward").value);
  const start_time = document.getElementById("start_time").value;
  const end_time = document.getElementById("end_time").value;
  const repeatDays = Array.from(
    document.querySelectorAll('input[name="repeat_days"]:checked')
  ).map((checkbox) => checkbox.value);

  const new_task = new Task(
    null,
    task_name,
    coin_reward,
    xp_reward,
    start_time,
    end_time,
    false,
    false,
    repeatDays
  );
  new_task.add_task();
  switch_to_main_window();
}

async function handleConcecensesForm(form) {
  const concecenses_name = document.getElementById("concecenses_name").value;
  // const concecenses_description = document.getElementById("").value;
  let concecenses_description = null;
  const new_concecenses = new Concecenses(
    "null",
    concecenses_name,
    concecenses_description
  );
  new_concecenses.add_concecenses();
  switch_to_main_window();
}
