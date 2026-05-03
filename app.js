// ---------- SUPABASE ----------
const supabase = window.supabase.createClient(
  "https://pvjdwtgsulrmxamxrwrx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2amR3dGdzdWxybXhhbXhyd3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzUxMzUsImV4cCI6MjA5MzQxMTEzNX0.2V9YYb8Imqvx8bGJT2pVNwUJnwE_BYYxINf-pcRbCQA"
);

window.onload = () => show("home");
let currentUser = null;
let role = "guest";

// ---------- PAGE SYSTEM ----------
function show(page) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  const target = document.getElementById(page);
  if (target) {
    target.classList.add("active");
  }
}

// ---------- SIGN UP ----------
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) console.log(error.message);
}
// ---------- LOGIN ----------
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) console.log(error.message);
}

// ---------- LOGOUT ----------
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.log(error.message);
}

// ---------- POST ----------
async function post() {
  const text = document.getElementById("postText").value;

  const { data, error } = await supabase
    .from("posts")
    .insert([{ text }]);

  if (error) console.log(error.message);
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
