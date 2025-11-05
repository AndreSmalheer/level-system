// Action.js
export class ActionItem {
  constructor({
    label,
    checkbox = false,
    clickfunc = null,
    popup = false,
    popupData = [],
    coin_reward = 0,
    xp_reward = 0,
    containerId = "tasks_container",
  }) {
    this.label = label;
    this.checkbox = checkbox;
    this.clickfunc = clickfunc;
    this.popup = popup;
    this.popupData = popupData;
    this.coin_reward = coin_reward;
    this.xp_reward = xp_reward;
    this.containerId = containerId;

    this.actionDiv = null;
    this.labelSpan = null;
  }

  create() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    this.actionDiv = document.createElement("div");
    this.actionDiv.classList.add("actionItem");

    const labelWrapper = document.createElement("label");
    labelWrapper.classList.add("actionLabel");
    this.actionDiv.appendChild(labelWrapper);

    this._addCheckbox(labelWrapper);
    this._addLabelText(labelWrapper);
    this._addRewards();
    this._addClickFunc();
    this._addPopup();

    container.appendChild(this.actionDiv);
  }

  _addCheckbox(labelWrapper) {
    if (!this.checkbox) return;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("action_chekbox");
    input.addEventListener("click", (e) => {
      e.stopPropagation();
      this.actionDiv.classList.toggle("completed", e.target.checked);
    });
    labelWrapper.appendChild(input);
  }

  _addLabelText(labelWrapper) {
    this.labelSpan = document.createElement("span");
    this.labelSpan.classList.add("actionText");
    this.labelSpan.textContent = this.label;
    labelWrapper.appendChild(this.labelSpan);
  }

  _addRewards() {
    if (!this.coin_reward && !this.xp_reward) return;

    const rewardContainer = document.createElement("div");
    rewardContainer.classList.add("reward_container");

    if (this.coin_reward) {
      const coinContainer = document.createElement("div");
      coinContainer.classList.add("coin_container");

      const coinIcon = document.createElement("img");
      coinIcon.classList.add("coin_icon");
      coinIcon.src = "/static/images/icons/coin.png";

      const coinAmount = document.createElement("h1");
      coinAmount.textContent = this.coin_reward;

      coinContainer.appendChild(coinIcon);
      coinContainer.appendChild(coinAmount);
      rewardContainer.appendChild(coinContainer);
    }

    if (this.xp_reward) {
      const xpContainer = document.createElement("div");
      xpContainer.classList.add("xp_container");

      const xpIcon = document.createElement("img");
      xpIcon.classList.add("coin_icon");
      xpIcon.src = "/static/images/icons/coin.png";

      const xpAmount = document.createElement("h1");
      xpAmount.textContent = this.xp_reward;

      xpContainer.appendChild(xpIcon);
      xpContainer.appendChild(xpAmount);
      rewardContainer.appendChild(xpContainer);
    }

    this.actionDiv.appendChild(rewardContainer);
  }

  _addClickFunc() {
    if (this.clickfunc) {
      this.actionDiv.addEventListener("click", this.clickfunc);
    }
  }

  _addPopup() {
    if (!this.popup) return;
    const popUp = document.querySelector(".task-pop-up");
    if (!popUp) return;

    this.actionDiv.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      popUp.innerHTML = "";

      const ul = document.createElement("ul");
      this.popupData.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.text || item;
        if (item.click && typeof item.click === "function") {
          li.addEventListener("click", () => {
            popUp.classList.remove("active");
            popUp.innerHTML = "";
            item.click();
          });
        }
        ul.appendChild(li);
      });

      popUp.appendChild(ul);
      popUp.style.left = `${e.pageX}px`;
      popUp.style.top = `${e.pageY}px`;
      popUp.classList.add("active");
    });
  }

  changeLabel(newContent) {
    if (this.labelSpan) {
      this.labelSpan.textContent = newContent;
      this.label = newContent;
    }
  }

  remove() {
    if (this.actionDiv) this.actionDiv.remove();
  }
}

// Example usage:
function washDishes() {
  console.log("Washing dishes...");
}

function dryDishes() {
  console.log("Drying dishes...");
}

const action = new ActionItem({
  label: "Do the dishes",
  checkbox: true,
  xp_reward: 20,
  coin_reward: 10,
  popup: true,
  popupData: [
    { text: "Wash dishes", click: washDishes },
    { text: "Dry dishes", click: dryDishes },
    "Put dishes away",
  ],
});

// example
const action_2 = new ActionItem({
  label: "Do the dishes",
});

// action.create();
// action_2.create();
