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
