
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database(pathJoin(__dirname, "database.db"));

function pathJoin(...args) {
  // Windows ve Linux için güvenli path join
  const path = require("path");
  return path.join(...args);
}

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS letters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    content TEXT NOT NULL,
    date_sent TEXT NOT NULL
  )`);

  db.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
    if (err) return;
    if (row && row.count === 0) {
      const u1 = bcrypt.hashSync("şifre123", 10);
      const u2 = bcrypt.hashSync("lokum", 10);
      db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ["Zeynep", u1]);
      db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ["Salih", u2]);
      console.log("Varsayılan kullanıcılar eklendi: Zeynep/Salih");
    }
  });
});

module.exports = db;
