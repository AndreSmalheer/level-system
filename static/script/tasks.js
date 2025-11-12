import { add_xp, remove_xp, set_xp } from "./progress.js";

export class Task {
  constructor(
    task_id,
    name,
    coinReward,
    expReward,
    start_time = null,
    end_time = null,
    completed = false,
    failed = false,
    repeat_days = []
  ) {
    this.name = name;
    this.coinReward = coinReward;
    this.expReward = expReward;
    this.start_time = start_time;
    this.end_time = end_time;
    this.completed = completed;
    this.failed = failed;
    this.repeat_days = repeat_days;
    this.task_id = task_id;
    this.task_element = document.getElementById(this.task_id) ?? null;
  }

  dom_add_task() {
    const tasksContainer = document.getElementById("tasks_container");

    // Create task wrapper
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.id = this.task_id;

    taskDiv.addEventListener("click", () => {
      this.click();
    });

    if (this.completed) {
      taskDiv.classList.add("completed");
    }

    // Create label
    const label = document.createElement("label");
    label.classList.add("task_label");

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task_checkbox");
    if (this.completed) checkbox.checked = true;

    checkbox.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    // Task name
    const span = document.createElement("span");
    span.classList.add("task_text");
    span.textContent = this.name;

    // Time container
    const timeContainer = document.createElement("div");
    timeContainer.classList.add("time_container");

    // Current time for scheduling/failed checks
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Start time
    const startTime = document.createElement("span");
    startTime.classList.add("start_time");
    startTime.textContent = this.start_time || ""; // empty string if not set
    if (this.start_time) {
      const [startHour, startMin] = this.start_time.split(":").map(Number);
      const startTotal = startHour * 60 + startMin;
      if (startTotal > currentTime) taskDiv.classList.add("scheduled");
    }
    timeContainer.appendChild(startTime);

    // End time
    const endTime = document.createElement("span");
    endTime.classList.add("end_time");
    endTime.textContent = this.end_time || ""; // empty string if not set
    if (this.end_time) {
      const [endHour, endMin] = this.end_time.split(":").map(Number);
      const endTotal = endHour * 60 + endMin;
      if (endTotal < currentTime && !this.completed)
        taskDiv.classList.add("failed");
    }
    timeContainer.appendChild(endTime);

    // Add to label
    label.appendChild(timeContainer);

    // Reward container
    const rewardContainer = document.createElement("div");
    rewardContainer.classList.add("reward_container");

    // Coin container
    const coinContainer = document.createElement("div");
    coinContainer.classList.add("coin_container");
    const coinIcon = document.createElement("img");
    coinIcon.classList.add("coin_icon");
    coinIcon.src = "/static/images/icons/coin.png";
    const coinAmount = document.createElement("h1");
    coinAmount.textContent = this.coinReward;
    coinContainer.appendChild(coinIcon);
    coinContainer.appendChild(coinAmount);

    // XP container
    const xpContainer = document.createElement("div");
    xpContainer.classList.add("xp_container");
    const xpIcon = document.createElement("img");
    xpIcon.classList.add("coin_icon");
    xpIcon.src = "/static/images/icons/coin.png";
    const xpAmount = document.createElement("h1");
    xpAmount.textContent = this.expReward;
    xpContainer.appendChild(xpIcon);
    xpContainer.appendChild(xpAmount);

    rewardContainer.appendChild(coinContainer);
    rewardContainer.appendChild(xpContainer);

    // Assemble label
    label.appendChild(checkbox);
    label.appendChild(span);
    label.appendChild(rewardContainer);

    // Add label to task div
    taskDiv.appendChild(label);

    // Add task to DOM
    tasksContainer.appendChild(taskDiv);

    this.task_element = taskDiv;

    // Reinitialize UI functions
    // initTaskPopUps();
    // initCheckboxes();
  }

  hide_task() {
    let task_element = document.getElementById(this.task_id);
    task_element.remove();
  }

  async update_task({
    name = this.name,
    coinReward = this.coinReward,
    expReward = this.expReward,
    start_time = this.start_time,
    end_time = this.end_time,
    completed = this.completed,
    failed = this.failed,
    repeat_days = this.repeat_days,
  } = {}) {
    // Update task values
    this.name = name;
    this.coinReward = coinReward;
    this.expReward = expReward;
    this.start_time = start_time;
    this.end_time = end_time;
    this.completed = completed;
    this.failed = failed;
    this.repeat_days = repeat_days;

    // Get elements
    let task_text = this.task_element.querySelector(".task_text");
    let coin_container = this.task_element.querySelector(".coin_container h1");
    let xp_container = this.task_element.querySelector(".xp_container h1");
    let status_coin_container = document
      .getElementById("coin_container")
      .querySelector("h1");
    let start_time_elem = this.task_element.querySelector(".start_time");
    let end_time_elem = this.task_element.querySelector(".end_time");

    // Update text
    task_text.textContent = name;
    coin_container.textContent = coinReward;
    xp_container.textContent = expReward;
    start_time_elem.textContent = start_time;
    end_time_elem.textContent = end_time;

    // call api
    const res = await fetch("/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "update_task",
        task_id: this.task_id,
        task_name: this.name,
        coin_reward: this.coinReward,
        xp_reward: this.expReward,
        start_time: this.start_time,
        end_time: this.end_time,
        completed: this.completed,
        failed: this.failed,
        repeat_days: this.repeat_days,
      }),
    });

    console.log((await res.json()).message);

    // If failed
    if (failed) {
      this.failed = true;
      this.task_element.classList.add("failed");
      return;
    }

    // If completed
    if (completed) {
      this.task_element.classList.add("completed");
      this.task_element.classList.remove("failed");
      status_coin_container.textContent =
        parseInt(status_coin_container.textContent) + this.coinReward;
      add_xp(this.expReward);
    } else {
      // Not completed
      this.task_element.classList.remove("completed");
      status_coin_container.textContent =
        parseInt(status_coin_container.textContent) - this.coinReward;
      remove_xp(this.expReward);
    }

    let current_coins = parseInt(status_coin_container.textContent);
    let current_xp = document.getElementById("current_xp").textContent;

    const res_2 = await fetch("/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "update_user_stats",
        user_id: user_id,
        level: currentLevel,
        coins: current_coins,
        xp: current_xp,
        xp_to_next_level: nextLevelXP,
      }),
    });

    console.log((await res_2.json()).message);
  }

  markFailed() {
    this.update_task({ failed: true });
  }

  click() {
    if (!this.completed) {
      this.update_task({ completed: true });
    } else {
      this.update_task({ completed: false });
    }
  }
}

const tasksMap = new Map();

for (const task of tasks) {
  let t = new Task(
    task.task_id,
    task.task_name,
    task.coin_reward,
    task.xp_reward,
    task.start_time,
    task.end_time,
    task.completed,
    task.failed,
    task.repeat_days
  );
  t.dom_add_task();
  tasksMap.set(task.task_id, t);
}

export { tasksMap };
