async function sendLetter() {
  const content = document.getElementById("content").value.trim();
  const sendMsg = document.getElementById("sendMsg");
  sendMsg.textContent = "";

  if (!content) { 
    sendMsg.textContent = "İçerik gerekli"; 
    return; 
  }

  try {
    // Oturum açan kullanıcıyı öğren
    const meRes = await fetch("/me", { credentials: "include" });
    const meData = await meRes.json();
    if (!meRes.ok || !meData.username) {
      sendMsg.textContent = "Giriş yapılmamış!";
      return;
    }

    // Karşı kullanıcıyı belirle
    const receiver = meData.username === "Zeynep" ? "Salih" : "Zeynep";

    // Mektubu gönder
    const res = await fetch("/letters/send", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver, content })
    });

    const data = await res.json();
    if (!res.ok) { 
      sendMsg.textContent = data.error || "Gönderilemedi"; 
      return; 
    }

    document.getElementById("content").value = "";
    if (typeof getMyLetters === "function") {
      getMyLetters();
    }
    sendMsg.textContent = "Mektup gönderildi.";
  } catch (e) {
    sendMsg.textContent = "Sunucu hatası";
    console.error(e);
  }
}

async function logout() {
  try {
    const res = await fetch("/logout", {
      method: "POST",
      credentials: "include"
    });
    const data = await res.json();
    if (res.ok) {
      window.location.href = "/login.html"; // giriş sayfasına yönlendir
    } else {
      alert(data.error || "Çıkış yapılamadı");
    }
  } catch (e) {
    console.error(e);
    alert("Sunucu hatası!");
  }
}

document.getElementById("changePasswordBtn").addEventListener("click", () => {
  const newPassword = prompt("Yeni şifrenizi girin:");
  if (!newPassword) return alert("Şifre boş olamaz");

  fetch("/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) alert("Şifre başarıyla değiştirildi!");
      else alert("Hata: " + data.error);
    })
    .catch(err => alert("Sunucu hatası: " + err));
});
