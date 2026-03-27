require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 DB
const db = mysql.createPool({
    host:process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
     database: process.env.DATABASE,
     charset:"utf8mb4",
});

// 📡 endpoint

app.get('/dane', async (req, res) => {
    try{
const [results] = await db.query( 'SELECT temperatura, TIME(data_pomiaru) AS godzina FROM pomiary ORDER BY data_pomiaru DESC');
 res.json(results);}
    catch(err){
        res.status(500).json({ error: err.message });

  }
});

app.post('/dodaj', async(req, res) => {
  const temp = parseFloat(req.body.temp);
    if(isNaN(temp))
        return res.status(400).json({error: "Nieprawidlowa temperatura"}); 
    try{
        await db.query('INSERT INTO pomiary (temperatura) VALUES (?)',[temp]);
        res.json({status: "OK"});}
    catch(err){res.ststus(500).json({error: err.message}); 
              }
});

// 🚀 start
app.listen(process.env.PORT, () => {
  console.log('Serwer działa');
});
