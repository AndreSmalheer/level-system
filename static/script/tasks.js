import { add_xp, remove_xp, set_xp } from "./progress.js";
import { switch_window } from "./system_windows.js";

function handleLiAction(action, taskId, current_item) {
  if (current_item == "tasks") {
    const task = tasksMap.get(taskId);

    if (action === "edit task") {
      const form = document.getElementById("edit_task_form");

      form.querySelector("#task_id").value = task.task_id;
      form.querySelector("#task_name").value = task.name;
      form.querySelector("#coin_reward").value = task.coinReward;
      form.querySelector("#xp_reward").value = task.expReward;
      form.querySelector("#start_time").value = task.start_time;
      form.querySelector("#end_time").value = task.end_time;

      if (task.repeat_days) {
        const checkboxes = form.querySelectorAll('input[name="repeat_days"]');
        checkboxes.forEach((checkbox) => {
          checkbox.checked = task.repeat_days.includes(checkbox.value);
        });
      }

      switch_window("edit_task_window");
    }

    if (action === "delete task") {
      const deleteTaskWindow = document.getElementById("delete_task_window");
      const taskIdElement = deleteTaskWindow.querySelector("#task_id");
      const span = deleteTaskWindow.querySelector("span");

      span.innerHTML = task.name;
      taskIdElement.innerHTML = taskId;

      switch_window("delete_task_window");
    }
  }

  if (current_item == "concecense") {
    console.log(action);
  }
}

class PopUp {
  constructor(id, items, x, y) {
    this.id = id;
    this.items = items;
    this.x = x;
    this.y = y;
    this.currentItemId = null;
    this.currentItemType = null;
  }
  create() {
    const popUp = document.createElement("div");
    popUp.className = "pop-up";
    popUp.id = this.id;

    popUp.textContent = this.textContent;
    popUp.classList.add("hide");

    document.body.addEventListener("click", (event) => {
      if (!popUp.contains(event.target)) {
        popUp.classList.add("hide");
      }
    });

    if (this.items.length > 0) {
      const ul = document.createElement("ul");
      for (let item of this.items) {
        const li = document.createElement("li");
        li.textContent = item;

        li.addEventListener("click", () => {
          this.LiCLick(item);
          this.hide();
        });

        ul.appendChild(li);
      }
      popUp.appendChild(ul);
    }

    document.body.appendChild(popUp);
    this.element = popUp;
  }

  show(x, y) {
    this.element.style.left = x + "px";
    this.element.style.top = y + "px";

    this.element.classList.remove("hide");
    this.element.classList.add("show");
  }

  hide() {
    this.element.classList.remove("show");
    this.element.classList.add("hide");
  }
  LiCLick(item) {
    const action = item.toLowerCase();
    handleLiAction(action, this.currentItemId, this.currentItemType);
  }
}

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
    taskDiv.classList.add("card");
    taskDiv.id = this.task_id;

    taskDiv.addEventListener("click", () => {
      this.click();
    });

    taskDiv.addEventListener("contextmenu", (e) => {
      taskPopUp.currentItemId = this.task_id;
      taskPopUp.currentItemType = "tasks";
      taskPopUp.show(e.pageX, e.pageY);
      e.preventDefault();
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

  add_task() {
    fetch("/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "add_task",
        task_name: this.name,
        coin_reward: this.coinReward,
        xp_reward: this.expReward,
        start_time: this.start_time,
        end_time: this.end_time,
        repeat_days: this.repeat_days,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.task_id = data.task.task_id;
        this.dom_add_task();
        tasksMap.set(this.task_id, this);
      });
  }

  remove_task() {
    // call api
    fetch("/api/remvoe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "remove_task",
        task_id: this.task_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.message);
        //  remove from task map
        tasksMap.delete(this.task_id);
        // remove from dom
        this.hide_task();
      });
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
    click = false,
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

    tasksMap.set(this.task_id, this);

    // If failed
    if (failed) {
      this.failed = true;
      this.task_element.classList.add("failed");
      return;
    }

    if (click) {
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

      currentUser.coins = current_coins;
      currentUser.xp = current_xp;

      const res_2 = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "update_user_stats",
          user_id: currentUser.id,
          level: currentUser.level,
          coins: currentUser.coins,
          xp: currentUser.xp,
          xp_to_next_level: currentUser.xpToNextLevel,
        }),
      });

      console.log((await res_2.json()).message);
    } else {
      if (completed) {
        this.task_element.classList.add("completed");
        this.task_element.classList.remove("failed");
      } else {
        // Not completed
        this.task_element.classList.remove("completed");
      }
    }
  }

  markFailed() {
    this.update_task({ failed: true });
  }

  click() {
    if (!this.completed) {
      this.update_task({ completed: true, click: true });
    } else {
      this.update_task({ completed: false, click: true });
    }
  }
}

export class Concecenses {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  click() {
    console.log(`clicked on ${this.concecense_element}`);
  }

  dom_add_concecenses() {
    const concecense_container = document.getElementById(
      "consequences_container"
    );

    const concecenseDiv = document.createElement("div");
    concecenseDiv.classList.add("concecense");
    concecenseDiv.classList.add("card");
    concecenseDiv.id = this.id;

    concecenseDiv.addEventListener("click", () => {
      this.click();
    });

    concecenseDiv.addEventListener("contextmenu", (e) => {
      concecensePopUp.currentItemId = this.task_id;
      concecensePopUp.currentItemType = "concecense";
      concecensePopUp.show(e.pageX, e.pageY);
      e.preventDefault();
    });

    const label = document.createElement("label");
    label.classList.add("consequences_label");

    const span = document.createElement("span");
    span.classList.add("concecense_text");
    span.textContent = this.name;

    label.appendChild(span);
    concecenseDiv.appendChild(label);

    this.concecense_element = concecenseDiv;

    // Add task to DOM
    concecense_container.appendChild(concecenseDiv);

    // concecenseDiv.addEventListener("contextmenu", (e) => {
    //   taskPopUp.currentItemId = this.task_id;
    //   taskPopUp.currentItemType = "tasks";
    //   taskPopUp.show(e.pageX, e.pageY);
    //   e.preventDefault();
    // });
  }

  add_concecenses() {
    fetch("/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "add_concecense",
        concecenses_name: this.name,
        concecenses_description: this.description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.id = data.concecenses.concecenses_id;
        this.dom_add_concecenses();
        concecensesMap.set(this.id, this);
      });
  }

  hide_concecenses() {}
}

// popups
const taskPopUp = new PopUp("task_popup", ["Edit Task", "Delete Task"]);
taskPopUp.create();

const concecensePopUp = new PopUp("concecense_popup", [
  "Edit concecense",
  "Delete concecense",
]);
concecensePopUp.create();

const tasksMap = new Map();
const concecensesMap = new Map();

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

for (const concecense of concecenses) {
  let c = new Concecenses(
    concecense.concecenses_id,
    concecense.name,
    concecense.description
  );

  c.dom_add_concecenses();
  concecensesMap.set(concecense.concecenses_id, c);
}

export { tasksMap, concecensesMap };
