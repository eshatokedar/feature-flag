const API_URL = 'https://feature-flag-bd79.onrender.com/flags';

async function fetchFlags() {
  const res = await fetch(API_URL);
  const flags = await res.json();

  const container = document.getElementById('flags');
  container.innerHTML = '';

  flags.forEach(flag => {
    const div = document.createElement('div');
    div.className = 'flag';
    div.innerHTML = `
      <strong>${flag.name}</strong> - ${flag.enabled ? '✅ ON' : '❌ OFF'}
      <button onclick="toggleFlag(${flag.id}, ${flag.enabled})">Toggle</button>
      <button onclick="deleteFlag(${flag.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

async function toggleFlag(id, current) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled: !current })
  });
  fetchFlags();
}

async function deleteFlag(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchFlags();
}

async function createFlag() {
  const name = document.getElementById('flagName').value;
  if (!name) return;
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, enabled: true })
  });
  document.getElementById('flagName').value = '';
  fetchFlags();
}

fetchFlags();
