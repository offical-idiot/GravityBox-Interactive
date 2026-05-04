// INIT (DO NOT CHANGE STYLE)
window.supabaseClient = window.supabase.createClient("https://pvjdwtgsulrmxamxrwrx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2amR3dGdzdWxybXhhbXhyd3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzUxMzUsImV4cCI6MjA5MzQxMTEzNX0.2V9YYb8Imqvx8bGJT2pVNwUJnwE_BYYxINf-pcRbCQA")

let currentUser = null;

// NAVIGATION
function show(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");

  if (page === "games") loadGames();
  if (page === "community") loadPosts();
  if (page === "profile") loadProfile();
}

window.onload = () => show("home");

// AUTH
async function signup() {
  const { error } = await window.supabaseClient.auth.signUp({
    email: email.value,
    password: password.value
  });

  if (error) alert(error.message);
}

async function login() {
  const { data, error } =
    await window.supabaseClient.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });

  if (error) return alert(error.message);

  currentUser = data.user;
  show("home");
}

// GAMES
async function loadGames() {
  const { data } = await window.supabaseClient.from("games").select("*");

  gamesList.innerHTML = "";

  data.forEach(g => {
    gamesList.innerHTML += `
      <div class="card" onclick="openGame('${g.title}', '${g.description}', '${g.url}')">
        <h3>${g.title}</h3>
        <p>${g.description}</p>
      </div>
    `;
  });
}

function openGame(title, desc, url) {
  gameTitle.textContent = title;
  gameDesc.textContent = desc;
  playBtn.onclick = () => window.location.href = url;
  show("game");
}

function playFeatured() {
  window.location.href = "games/untitled-sandbox/index.html";
}

// FORUM
async function post() {
  await window.supabaseClient.from("posts").insert([
    { text: postText.value }
  ]);
  loadPosts();
}

async function loadPosts() {
  const { data } = await window.supabaseClient.from("posts").select("*");

  posts.innerHTML = "";
  data.forEach(p => {
    posts.innerHTML += `<div class="card">${p.text}</div>`;
  });
}

// PROFILE
async function loadProfile() {
  const { data } = await window.supabaseClient.auth.getUser();

  if (!data.user) return;

  profileEmail.textContent = "Email: " + data.user.email;
}
