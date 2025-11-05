const listItems = document.querySelectorAll("#selection_list li");
const task_container = document.getElementById("tasks_container");
const consequences = document.getElementById("consequences_container");

listItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove active class from all
    listItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    // Hide all containers
    task_container.style.display = "none";
    consequences.style.display = "none";

    // Show the right container
    if (item.textContent.trim() == "Consequences") {
      consequences.style.display = "flex";
    }

    if (item.textContent.trim() === "Tasks") {
      task_container.style.display = "flex";
    }
  });
});
