const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcrypt");

const db = require("./db");
const lettersRouter = require("./letters");

const app = express();

// Parse JSON
app.use(bodyParser.json());

app.use(session({
  secret: "gizli-anahtar-degistir",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,   // localhost için false
    sameSite: "lax", // frontend ve backend aynı origin’deyse sorun yok
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Static frontend (single port)
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Kullanıcı adı/şifre gerekli" });

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Kullanıcı bulunamadı" });

    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = username;
      // session kaydını garanti et
      req.session.save(err => {
        if (err) return res.status(500).json({ error: "Session kaydedilemedi" });
        return res.json({ success: true, user: username });
      });
    } else {
      return res.status(401).json({ error: "Şifre yanlış" });
    }
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Session silinemedi" });
    return res.json({ success: true });
  });
});

// Letters route (authenticated)
app.use("/letters", lettersRouter);

// 🔹 Kullanıcı bilgisini almak için endpoint
app.get("/me", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Giriş yapılmamış" });
  }
  res.json({ username: req.session.user });
});

// Default route: serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ayakta: http://localhost:${PORT}`);
});
