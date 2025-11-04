const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory store (demo only)
const users = new Map();
let nextAccountId = 17895;
const accounts = [];

app.use(express.static(path.join(__dirname, 'demo-site')));

// POST /register.htm
app.post('/register.htm', (req, res) => {
  const { 'customer.username': username, 'customer.password': password } = req.body;
  if (!username || !password) {
    return res.redirect('/register.htm');
  }
  users.set(username, { username, password });
  return res.redirect('/register-success.htm');
});

// POST /login.htm
app.post('/login.htm', (req, res) => {
  const { username, password } = req.body;
  // Accept if user exists or any non-empty credentials (demo)
  if (users.has(username) || (username && password)) {
    return res.redirect('/home.htm');
  }
  return res.redirect('/index.htm');
});

// POST open new account
app.post('/openaccount.htm', (req, res) => {
  const acc = String(nextAccountId++);
  accounts.push(acc);
  res.redirect(`/open-account-success.htm?account=${acc}`);
});

// GET transfer funds page - serve transfer page which includes account options
app.get('/transfer.htm', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo-site', 'transfer.htm'));
});

// POST transfer
app.post('/transfer.htm', (req, res) => {
  const { amount, toAccountId } = req.body;
  res.redirect(`/transfer-success.htm?to=${encodeURIComponent(toAccountId)}&amount=${encodeURIComponent(amount)}`);
});

// POST billpay
app.post('/billpay.htm', (req, res) => {
  const { 'payee.name': name } = req.body;
  res.redirect(`/billpay-success.htm?name=${encodeURIComponent(name)}`);
});

const port = process.env.DEMO_PORT || 3000;
app.listen(port, () => console.log(`Demo server running at http://127.0.0.1:${port}/`));

module.exports = app;
