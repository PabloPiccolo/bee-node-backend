require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());

// 🔌 DB
const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
     database: process.env.DATABASE,
     charset:"utf8mb4",
});

// 📡 endpoint

app.get('/dane', (req, res) => {
  const sql = 'SELECT temperatura, TIME(data) AS godzina FROM pomiary ORDER BY data DESC LIMIT 50';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/dodaj', (req, res) => {
  const temp = req.query.temp;

  const sql = 'INSERT INTO pomiary (temperatura) VALUES (?)';

  db.query(sql, [temp], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ status: 'OK' });
  });
});

// 🚀 start
app.listen(process.env.PORT, () => {
  console.log('Serwer działa');
});
