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
      // console.log("Deleted:", data);
    })
    .catch((err) => console.error("Error:", err));

  switch_window("system_container");
}

export async function getTaskDetails(taskID) {
  const url = `/getTaskDetails/${encodeURIComponent(taskID)}`;

  try {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) throw new Error("Request failed: " + res.status);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

export async function getPunishmentDetail(punishment_id) {
  const url = `/getPunishmint/${punishment_id}`;

  try {
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) throw new Error("Request failed: " + res.status);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}

export async function add_punishment_as_task(punishment) {
  const url = `/add_punishment_as_task`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(punishment),
    });
    if (!res.ok) throw new Error("Request failed: " + res.status);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error:", err);
  }
}
