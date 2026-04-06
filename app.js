const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello DevSecOps');
});

// Vulnerable endpoint (XSS)
app.get('/user', (req, res) => {
  const name = req.query.name;
  res.send("Hello " + name);
});

app.listen(3000, () => {
  console.log('App running on port 3000');
});
