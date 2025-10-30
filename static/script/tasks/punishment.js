import {
  getTaskDetails,
  getPunishmentDetail,
  add_punishment_as_task,
  removeTask,
} from "../api.js";
import { show_window, switch_window } from "../system.js";
import { addTaskToDOM, removeTaskFromDOM } from "./domTasks.js";

export async function accept_punishment(punishment, task) {
  if (punishment == `none`) {
    console.warn("no punishment previded");
    return;
  }

  let exported_task = {
    task_name: punishment.name,
    coin_reward: task.coin_reward * -2,
    xp_reward: task.xp_reward * -2,
  };

  let result = await add_punishment_as_task(exported_task);

  console.log(result);

  addTaskToDOM(result.punishment);
  removeTaskFromDOM(task.task_id);

  removeTask(task.task_id);

  switch_window("system_container");
}

export async function setup_accepet_punishment_window(task_id) {
  let task = await getTaskDetails(task_id);
  const punishment = await getPunishmentDetail(task.task.penelty_id);

  document.getElementById("punishment_task").innerHTML = task.task.task_name;

  const accept_button = document.getElementById("accept_punishment_button");
  document.getElementById("punishment").innerHTML = punishment["name"];

  accept_button.addEventListener("click", () =>
    accept_punishment(punishment, task.task)
  );

  switch_window("penelty_window");
}
