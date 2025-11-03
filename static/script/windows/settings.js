import { switch_window} from '../system.js';

function load_settings() {
    document.getElementById('setting_user_name').value = user_name;
}

const settings_icon = document.getElementById('settings_icon');

settings_icon.addEventListener('click', () => {
    load_settings();
    switch_window('settings_window');
});

document
  .getElementById("settings_form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    user_name = formData.get('setting_user_name');
    document.getElementById('name').innerText = user_name;
    
    const url = `/update_settings`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name }),
    });

    switch_window('system_container');
});