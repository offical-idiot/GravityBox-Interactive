// ---------- SUPABASE ----------

window.supabaseClient = window.supabase.createClient("https://pvjdwtgsulrmxamxrwrx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2amR3dGdzdWxybXhhbXhyd3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzUxMzUsImV4cCI6MjA5MzQxMTEzNX0.2V9YYb8Imqvx8bGJT2pVNwUJnwE_BYYxINf-pcRbCQA")
window.onload = () => {
  show("home");
};
let currentUser = null;
let role = "guest";

// ---------- PAGE SYSTEM ----------
function show(page) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.add("hidden");
  });

  document.getElementById(page).classList.remove("hidden");

  if (page === "forum") {
    loadPosts();
  }
  if (page === "games") {
    loadGames();
  }
  if (page === "profile") {
    loadProfile();
  }
}

// ---------- SIGN UP ----------
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await window.supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) return console.log(error.message);
}

// ---------- LOGIN ----------
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) console.log(error.message);
  await loadProfile();
}

// ---------- LOGOUT ----------
async function logout() {
  const { error } = await window.supabaseClient.auth.signOut();
  if (error) console.log(error.message);
}

// ---------- POST ----------
async function post() {
  const text = document.getElementById("postText").value;

  if (!text || !currentUser) return;

  await window.supabaseClient.from("posts").insert([
    {
      user: currentUser.email,
      text: text
    }
  ]);

  loadPosts();
}
// ---------- LOAD POSTS ----------
async function loadPosts() {
  const { data } = await window.supabaseClient.from("posts").select("*");

  let div = document.getElementById("posts");
  div.innerHTML = "";

  data.forEach(p => {
    div.innerHTML += `
      <p><b>[${p.role}] ${p.user}:</b> ${p.text}</p>
    `;
  });
}

// ---------- ADMIN ----------
async function clearPosts() {
  await window.supabaseClient.from("posts").delete().neq("id", 0);
  loadPosts();
}
function isAdmin() {
  return currentUser?.email === "gravitybox@admin.com";
}
if (isAdmin()) {
  document.getElementById("adminPanel").style.display = "block";
}
// ---------- GAMES ----------
async function loadGames() {
  const { data } = await window.supabaseClient.from("games").select("*");

  const container = document.getElementById("gamesList");
  container.innerHTML = "";

  data.forEach(g => {
    container.innerHTML += `
      <div class="card">
        <h3>${g.title}</h3>
        <p>${g.description}</p>
        <button onclick="window.open('${g.url}', '_blank')">Play</button>
      </div>
    `;
  });
}
// ---------- PROFILES ----------
function getProfile() {
  return {
    email: currentUser.email,
    role: isAdmin() ? "admin" : "user"
  };
}
async function loadProfile() {
  const { data: userData } =
    await window.supabaseClient.auth.getUser();

  const user = userData.user;

  if (!user) return;

  // get profile from database (if you made profiles table)
  const { data: profile } = await window.supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  document.getElementById("profileName").textContent =
    profile?.email || "No Email";

  document.getElementById("profileEmail").textContent =
    user.email;

  document.getElementById("profileRole").textContent =
    user.email === "gravitybox@admin.com"
      ? "Admin 👑"
      : "User";
}
