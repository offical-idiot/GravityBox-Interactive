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
  const { data, error } = await window.supabaseClient
    .from("games")
    .select("*");

  if (error) {
    console.log("Supabase error:", error.message);
    return;
  }

  if (!Array.isArray(data)) {
    console.log("Games returned invalid data:", data);
    return;
  }

  const container = document.getElementById("gamesList");
  container.innerHTML = "";

  data.forEach(g => {
    container.innerHTML += `
      <div class="card">
        <h3>${g.title}</h3>
        <p>Creator: ${g.creator || "unknown"}</p>
        <p>Publisher: ${g.publisher || "unknown"}</p>
        <p>${g.description}</p>
        <a href="${g.url}">
          <button>Open</button>
        </a>
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
  alert("ALPHA TEST, NOT FINISHED!")
  window.location.href = "games/untitled-sandbox/index.html";
}

// FORUM
async function post() {
  const text = document.getElementById("postText").value;

  const { data: userData } =
    await window.supabaseClient.auth.getUser();

  const email = userData.user.email;

  await window.supabaseClient.from("posts").insert([
    {
      text: text,
      email: email
    }
  ]);

  loadPosts();
}

async function loadPosts() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log("Post error:", error.message);
    return;
  }

  if (!Array.isArray(data)) return;

  const container = document.getElementById("posts");
  container.innerHTML = "";

  data.forEach(p => {
    const email = p.email;

    // CUSTOM NAME RULE
    let displayName = email;

    if (email === "monkomonko50@gmail.com") {
      displayName = "GravityBox Interactive ✔";
    }

    container.innerHTML += `
      <div class="card">
        <b>${displayName}</b>
        <p>${p.text}</p>
      </div>
    `;
  });
}

// PROFILE
async function loadProfile() {
  const { data } = await window.supabaseClient.auth.getUser();

  if (!data.user) return;

  profileEmail.textContent = "Email: " + data.user.email;
}
