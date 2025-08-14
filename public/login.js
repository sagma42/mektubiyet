
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");
  msg.textContent = "";

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      msg.textContent = data.error || "Hata oluştu";
      return;
    }
    window.location.href = "/home.html";
  } catch (e) {
    msg.textContent = "Sunucuya bağlanılamıyor";
  }
}

function forgotpassword() {
window.location.href = "/forgotpassword.html";


}