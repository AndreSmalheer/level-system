let current_window = null;

export function show_window(windowId) {
  const container = document.getElementById(windowId);
  if (!container) return;

  const audio = document.getElementById("openSound");
  audio.currentTime = 0;
  audio.play().catch((e) => {});

  current_window = windowId;
  container.style.display = "flex";
  container.classList.add("active");
}

export function hide_window(windowId) {
  const container = document.getElementById(windowId);
  if (!container) return;

  container.classList.remove("active");
  void container.offsetWidth; // force reflow
  container.classList.add("deactive");

  function onAnimationEnd() {
    if (container.classList.contains("deactive")) {
      container.classList.remove("deactive");
    }
    container.style.display = "none"; // hide element
    container.removeEventListener("animationend", onAnimationEnd);
  }

  container.addEventListener("animationend", onAnimationEnd);
}

export function switch_window(new_windowId) {
  const newContainer = document.getElementById(new_windowId);
  if (!newContainer) return;

  if (!current_window) {
    show_window(new_windowId);
    return;
  }

  const oldContainer = document.getElementById(current_window);
  if (!oldContainer) {
    show_window(new_windowId);
    return;
  }

  function onOldAnimationEnd() {
    oldContainer.removeEventListener("animationend", onOldAnimationEnd);

    setTimeout(() => {
      show_window(new_windowId);
    }, 200);
  }

  oldContainer.addEventListener("animationend", onOldAnimationEnd);
  hide_window(current_window);
}

export function hide_current_window() {
  if (current_window != null) {
    hide_window(current_window);
  } else {
    console.warn("no current window");
  }
}

export function get_current_window() {
  return current_window;
}

export function switch_to_main_window() {
  switch_window("main_window");
}
