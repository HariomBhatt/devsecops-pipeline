const express = require('express');
const escape = require('escape-html');
const app = express();

// 🔴 Hardcoded Secret (Vulnerability 1)
const API_KEY = "12345-SECRET-KEY";

// 🔴 XSS Vulnerability (Vulnerability 2)
app.get('/user', (req, res) => {
  const name = req.query.name;
  res.send("Hello " + escape(name || ""));
});

// 🔴 SQL Injection (Vulnerability 3)
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, username TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin'), (2, 'user')");
});

app.get('/search', (req, res) => {
  const username = req.query.username;

  const query = `SELECT * FROM users WHERE username = '${username}'`; // vulnerable

  db.all(query, [], (err, rows) => {
    if (err) {
      res.send("Error");
    } else {
      res.json(rows);
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
