const express = require("express");
const router = express.Router();
const db = require("./db");
const isAuthenticated = require("./auth");

// Mektup gönderme
// letters.js
router.post("/send", isAuthenticated, (req, res) => {
  const { content } = req.body;
  const sender = req.session.user;
  const receiver = sender === "Zeynep" ? "Salih" : "Zeynep";

  const visibleDate = "2026-06-16"; // görünür olacağı tarih

  db.run(
    `INSERT INTO letters (sender, receiver, content, date_sent, visibleDate) VALUES (?, ?, ?, ?, ?)`,
    [sender, receiver, content, new Date().toISOString(), visibleDate],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Kendi yazdığı mektuplar
router.get("/my", isAuthenticated, (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  db.all(
    `SELECT * FROM letters WHERE sender = ? ORDER BY date_sent DESC`,
    [req.session.user],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      // Gönderdiği mektuplar görünür tarihi farketmez, direkt göster
      return res.json(rows);
    }
  );
});

// Kullanıcıya gelen mektuplar
router.get("/received", isAuthenticated, (req, res) => {
  const username = req.session.user;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  db.all(
    "SELECT id, sender, content, date_sent, visibleDate FROM letters WHERE receiver = ? ORDER BY date_sent DESC",
    [username],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      // Sadece görünme tarihi gelmiş mektupları göster
      const visibleLetters = rows.filter(l => !l.visibleDate || l.visibleDate <= today);
      res.json(visibleLetters);
    }
  );
});

module.exports = router;
