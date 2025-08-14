const db = require("./db");

db.run("ALTER TABLE letters ADD COLUMN visibleDate TEXT", (err) => {
  if (err) {
    console.error("Hata:", err.message);
  } else {
    console.log("visibleDate sütunu eklendi.");
  }
  db.close();
});
