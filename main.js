const list = document.getElementById("view_selector");
const items = list.querySelectorAll("li");

/* <div id="task_1" class="task">
  <label class="task_label">
    <input type="checkbox" class="task_checkbox" />
    <span class="task_text">Go to shop</span>

    <div class="time_container">
      <span class="start_time">09:00</span>
      <span class="end_time">10:00</span>
    </div>

    <div class="reward_container">
      <div class="coin_container">
        <img class="coin_icon" src="/static/images/icons/coin.png" />
        <h1>10</h1>
      </div>

      <div class="xp_container">
        <img class="coin_icon" src="/static/images/icons/coin.png" />
        <h1>20</h1>
      </div>
    </div>
  </label>
</div> */

function addAction(label, checkbox = false, clickfunc = false, popup = false) {
  const container = document.getElementById("action_container");

  container.innerHTML = `<span class="action_text"> ${label}</span>`;

  if (checkbox) {
    container.innerHTML += `<input type="checkbox" class="action_checkbox" />`;
  }

  if (clickfunc) {
    container.addEventListener("click", (event) => {
      clickfunc();
    });
  }
}

function hello() {
  console.log("hey");
}

addAction("test", false, hello);

// function unselect_all() {
//   for (const item of items) {
//     item.classList.remove("active");
//   }
// }

// function show_actions(tab) {
//   // Hide all containers first
//   const containers = document.querySelectorAll(".tab_container");
//   containers.forEach((container) => (container.style.display = "none"));

//   // Then show the selected one
//   const element = document.getElementById(tab);
//   if (element) {
//     element.style.display = "block";
//   }
// }

// show_actions("task_container");

// for (const item of items) {
//   item.addEventListener("click", () => {
//     unselect_all();
//     item.classList.add("active");

//     const name = item.id;

//     if (name === "tab_consequences") {
//       console.log("Consequences tab selected");
//       show_actions("consequences_container");
//     }

//     if (name === "tab_tasks") {
//       console.log("Tasks tab selected");
//       show_actions("task_container");
//     }
//   });
// }
