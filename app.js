const supabase = window.supabase.createClient(
  "https://pvjdwtgsulrmxamxrwrx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2amR3dGdzdWxybXhhbXhyd3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzUxMzUsImV4cCI6MjA5MzQxMTEzNX0.2V9YYb8Imqvx8bGJT2pVNwUJnwE_BYYxINf-pcRbCQA"
);

let currentUser = null;
let role = "guest";

// ---------- NAV ----------
function show(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");

  if (page === "forum") loadPosts();
}

// ---------- SIGN UP ----------
async function signup() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  alert("Account created!");
}

// ---------- LOGIN ----------
async function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  currentUser = data.user;

  // 👑 ADMIN CHECK
  if (email === "gravitybox@admin.com") {
    role = "admin";
    show("admin");
  } else {
    role = "user";
    show("home");
  }
}

// ---------- LOGOUT ----------
async function logout() {
  await supabase.auth.signOut();
  currentUser = null;
  role = "guest";
  show("home");
}

// ---------- POST ----------
async function post() {
  let text = document.getElementById("postText").value;

  await supabase.from("posts").insert([
    {
      user: currentUser.email,
      text: text,
      role: role
    }
  ]);

  loadPosts();
}

// ---------- LOAD POSTS ----------
async function loadPosts() {
  const { data } = await supabase.from("posts").select("*");

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
  await supabase.from("posts").delete().neq("id", 0);
  loadPosts();
}
