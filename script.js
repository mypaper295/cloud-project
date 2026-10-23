// Initial Mock Data stored in LocalStorage if empty
const defaultEvents = [
  { id: 1, title: "AI & Machine Learning Workshop", description: "Hands-on coding session covering foundational algorithms.", date: "2026-11-15", time: "10:00 AM", location: "Auditorium A", category: "Workshop", capacity: 50 },
  { id: 2, title: "Annual Inter-Department Sports Gala", description: "Cricket, Football, and Table Tennis competitions.", date: "2026-11-20", time: "09:00 AM", location: "Main Sports Complex", category: "Sports", capacity: 200 },
  { id: 3, title: "Cybersecurity & Ethical Hacking Seminar", description: "Learn network defense tactics from industry experts.", date: "2026-11-25", time: "02:00 PM", location: "Hall B", category: "Seminar", capacity: 100 }
];

if (!localStorage.getItem('events')) {
  localStorage.setItem('events', JSON.stringify(defaultEvents));
}
if (!localStorage.getItem('registrations')) {
  localStorage.setItem('registrations', JSON.stringify([]));
}

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

document.addEventListener('DOMContentLoaded', () => {
  updateUserUI();
  renderEvents();
  renderRegistrations();
});

function getEvents() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function getRegistrations() {
  return JSON.parse(localStorage.getItem('registrations')) || [];
}

function updateUserUI() {
  const userDisplay = document.getElementById('user-display');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');

  if (currentUser) {
    userDisplay.textContent = `Hello, ${currentUser.name}`;
    userDisplay.style.display = 'inline';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline';
  } else {
    userDisplay.style.display = 'none';
    loginBtn.style.display = 'inline';
    logoutBtn.style.display = 'none';
  }
}

function showSection(sectionName) {
  document.getElementById('home-section').classList.add('hidden');
  document.getElementById('events-section').classList.add('hidden');
  document.getElementById('admin-section').classList.add('hidden');

  if (sectionName === 'home') document.getElementById('home-section').classList.remove('hidden');
  if (sectionName === 'events') document.getElementById('events-section').classList.remove('hidden');
  if (sectionName === 'admin') {
    document.getElementById('admin-section').classList.remove('hidden');
    renderRegistrations();
  }
}

function renderEvents(eventsToDisplay = null) {
  const events = eventsToDisplay || getEvents();
  const homeGrid = document.getElementById('featured-events-grid');
  const listGrid = document.getElementById('events-list-grid');

  const eventHTML = events.map(e => `
    <div class="event-card">
      <div>
        <span class="category">${e.category}</span>
        <h3>${e.title}</h3>
        <p>${e.description}</p>
        <br>
        <p><strong>📅 Date:</strong> ${e.date} | ${e.time}</p>
        <p><strong>📍 Location:</strong> ${e.location}</p>
        <p><strong>👥 Capacity:</strong> ${e.capacity}</p>
      </div>
      <button class="register-btn" onclick="registerForEvent('${e.title}')">Register Now</button>
    </div>
  `).join('');

  if (homeGrid) homeGrid.innerHTML = eventHTML.slice(0, 3);
  if (listGrid) listGrid.innerHTML = eventHTML || '<p>No events found matching criteria.</p>';
}

function filterEvents() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const category = document.getElementById('category-filter').value;
  const events = getEvents();

  const filtered = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search) || e.description.toLowerCase().includes(search);
    const matchesCategory = category === 'ALL' || e.category === category;
    return matchesSearch && matchesCategory;
  });

  renderEvents(filtered);
}

function registerForEvent(eventTitle) {
  if (!currentUser) {
    alert('Please login first to register for an event.');
    showModal('auth-modal');
    return;
  }

  const registrations = getRegistrations();
  registrations.push({
    userName: currentUser.name,
    userEmail: currentUser.email,
    eventTitle: eventTitle,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem('registrations', JSON.stringify(registrations));
  alert(`Successfully registered for ${eventTitle}!`);
  renderRegistrations();
}

function createEvent(e) {
  e.preventDefault();
  const events = getEvents();
  const newEvent = {
    id: Date.now(),
    title: document.getElementById('event-title').value,
    description: document.getElementById('event-desc').value,
    date: document.getElementById('event-date').value,
    time: document.getElementById('event-time').value,
    location: document.getElementById('event-location').value,
    category: document.getElementById('event-category').value,
    capacity: document.getElementById('event-capacity').value
  };

  events.push(newEvent);
  localStorage.setItem('events', JSON.stringify(events));
  alert('Event Created Successfully!');
  document.getElementById('create-event-form').reset();
  renderEvents();
  showSection('events');
}

function renderRegistrations() {
  const regList = document.getElementById('registrations-list');
  const registrations = getRegistrations();

  if (registrations.length === 0) {
    regList.innerHTML = '<p>No student registrations recorded yet.</p>';
    return;
  }

  regList.innerHTML = registrations.map(r => `
    <div style="background:#fff; padding:0.75rem; margin-bottom:0.5rem; border-radius:4px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <strong>${r.userName}</strong> (${r.userEmail}) <br> Registered for: <em>${r.eventTitle}</em> on ${r.date}
    </div>
  `).join('');
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  currentUser = { name: email.split('@')[0], email: email };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateUserUI();
  closeModal('auth-modal');
  alert('Logged in successfully!');
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  currentUser = { name: name, email: email };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateUserUI();
  closeModal('auth-modal');
  alert('Account created and logged in!');
}

function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  updateUserUI();
  alert('Logged out.');
}

function showModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function switchAuthTab(tab) {
  if (tab === 'login') {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('tab-login').classList.add('active-tab');
    document.getElementById('tab-signup').classList.remove('active-tab');
  } else {
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('tab-signup').classList.add('active-tab');
    document.getElementById('tab-login').classList.remove('active-tab');
  }
}