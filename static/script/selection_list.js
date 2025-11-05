const listItems = document.querySelectorAll("#selection_list li");
const task_container = document.getElementById("tasks_container");
const consequences = document.getElementById("consequences_container");
const add_consequence_btn = document.getElementById("add_consequence_btn");
const add_task_btn = document.getElementById("add_task_btn");

listItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove active class from all
    listItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    // Hide all containers
    task_container.style.display = "none";
    consequences.style.display = "none";
    add_task_btn.style.display = "none";
    add_consequence_btn.style.display = "none";

    // Show the right container
    if (item.textContent.trim() == "Consequences") {
      consequences.style.display = "flex";
      add_consequence_btn.style.display = "block";
    }

    if (item.textContent.trim() === "Tasks") {
      task_container.style.display = "flex";
      add_task_btn.style.display = "block";
    }
  });
});
