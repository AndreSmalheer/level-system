class Action {
  constructor(label, checkbox = false, clickfunc = false, popup = false) {
    this.label = label;
    this.checkbox = checkbox;
    this.clickfunc = clickfunc;
    this.popup = popup;
  }

  create() {
    const container = document.getElementById("tasks_container");

    // Create main wrapper
    const actionDiv = document.createElement("div");
    actionDiv.classList.add("task");

    const actionLabel = document.createElement("label");
    actionLabel.classList.add("task_label");
    actionDiv.appendChild(actionLabel);

    // Add checkbox (if enabled)
    if (this.checkbox) {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.classList.add("task_checkbox");
      actionLabel.appendChild(input);
    }

    // Add label text
    const labelSpan = document.createElement("span");
    labelSpan.classList.add("task_text");
    labelSpan.textContent = this.label;
    actionLabel.appendChild(labelSpan);

    // Add click function (if provided)
    if (this.clickfunc) {
      actionDiv.addEventListener("click", this.clickfunc);
    }

    // Add popup (if true)
    if (this.popup) {
      actionDiv.addEventListener("click", () => {
        alert(`Popup for: ${this.label}`);
      });
    }

    // Add to container
    container.appendChild(actionDiv);
  }
}

function hello() {
  console.log("hey");
}

const action1 = new Action("Test Action", true, hello);
action1.create();
