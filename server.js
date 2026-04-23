const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Autorise ton frontend à appeler l'API
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Configuration pour le Pooler (port 6543)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Indispensable pour Render + Supabase
  }
});

// Route pour vérifier que la base de données répond
app.get('/health', async (req, res) => {
  try {
    const resDb = await pool.query('SELECT NOW()');
    res.json({ status: "OK", time: resDb.rows[0] });
  } catch (err) {
    res.status(500).json({ status: "Erreur", error: err.message });
  }
});

// Ta route principale pour les animaux
app.get('/animaux', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animaux');
    console.log("Animaux récupérés :", result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur SQL détaillée:", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération des données" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur prêt sur le port ${PORT}`);
});