export function setTaskStatus(taskName, completed) {
  const endpoint = completed ? "/completed_task/" : "/uncomplete_task/";
  const url = `${endpoint}${encodeURIComponent(taskName)}`;

  fetch(url, { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      console.log(
        completed ? "✅ Task completed:" : "❌ Task uncompleted:",
        data
      );
    })
    .catch((err) => console.error("Error:", err));
}

export function removeTask(taskID) {
  const url = `/delete_task/${encodeURIComponent(taskID)}`;

  fetch(url, { method: "POST" })
    .then((res) => {
      if (!res.ok) throw new Error("Request failed: " + res.status);
      return res.json();
    })
    .then((data) => {
      console.log("Deleted:", data);
    })
    .catch((err) => console.error("Error:", err));

  switch_window("system_container");
}
