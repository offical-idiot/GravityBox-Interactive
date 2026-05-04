// INIT
window.supabaseClient = window.supabase.createClient("https://pvjdwtgsulrmxamxrwrx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2amR3dGdzdWxybXhhbXhyd3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzUxMzUsImV4cCI6MjA5MzQxMTEzNX0.2V9YYb8Imqvx8bGJT2pVNwUJnwE_BYYxINf-pcRbCQA")

let currentUser = null;

// NAVIGATION
function show(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");

  if (page === "games") loadGames();
  if (page === "forum") loadPosts();
  if (page === "profile") loadProfile();
}

// HOME LOAD
window.onload = () => show("home");

// AUTH
async function login() {
  const email = email.value;
  const password = password.value;

  const { data, error } =
    await window.supabaseClient.auth.signInWithPassword({ email, password });

  if (error) return alert(error.message);

  currentUser = data.user;
  show("home");
}

async function signup() {
  const { error } =
    await window.supabaseClient.auth.signUp({
      email: email.value,
      password: password.value
    });

  if (error) alert(error.message);
}

// GAMES
async function loadGames() {
  const { data } = await window.supabaseClient.from("games").select("*");

  const container = document.getElementById("gamesList");
  container.innerHTML = "";

  data.forEach(g => {
    container.innerHTML += `
      <div class="game-card" onclick="openGamePage('${g.title}', '${g.description}', '${g.url}')">
        <h3>${g.title}</h3>
        <p>${g.description}</p>
      </div>
    `;
  });
}

function openGamePage(title, desc, url) {
  document.getElementById("gameTitle").textContent = title;
  document.getElementById("gameDesc").textContent = desc;

  document.getElementById("playBtn").onclick = () => {
    window.location.href = url;
  };

  show("gameView");
}

function openGame() {
  window.location.href = "games/untitled-sandbox/index.html";
}

// FORUM
async function post() {
  const text = postText.value;

  await window.supabaseClient.from("posts").insert([
    { text }
  ]);

  loadPosts();
}

async function loadPosts() {
  const { data } = await window.supabaseClient.from("posts").select("*");

  posts.innerHTML = "";
  data.forEach(p => {
    posts.innerHTML += `<div class="game-card">${p.text}</div>`;
  });
}

// PROFILE
async function loadProfile() {
  const { data } = await window.supabaseClient.auth.getUser();

  profileEmail.textContent = data.user.email;
}
