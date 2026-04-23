import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configuration CORS
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Configuration pour le Pooler Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Route de test
app.get('/health', async (req, res) => {
  try {
    const resDb = await pool.query('SELECT NOW()');
    res.json({ status: "OK", time: resDb.rows[0] });
  } catch (err) {
    res.status(500).json({ status: "Erreur", error: err.message });
  }
});

// Route principale pour les animaux
app.get('/animaux', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animaux');
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur SQL:", err.message);
    res.status(500).json({ error: "Erreur lors de la récupération des données" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});