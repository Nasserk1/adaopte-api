const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Configuration de la connexion à Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

// Route pour récupérer tous les animaux
app.get('/animaux', async (req, res) => {
  try {
    // On utilise "animals" car c'est le nom dans ta base de données
    // On fait des JOIN pour avoir le nom de la race et du refuge en clair
    const query = `
      SELECT 
        a.*, 
        b.name as breed, 
        t.name as type,
        s.name as shelter,
        s.address,
        s.city,
        s.zip_code,
        s.phone,
        s.email
      FROM animals a
      LEFT JOIN breeds b ON a.breed_id = b.id
      LEFT JOIN types t ON b.type_id = t.id
      LEFT JOIN shelters s ON a.shelter_id = s.id
    `;
    
    const result = await pool.query(query);
    console.log("Données récupérées avec succès depuis la table animals");
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur SQL détaillée :', err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des données', details: err.message });
  }
});

// Route de test pour vérifier que le serveur répond
app.get('/', (req, res) => {
  res.send('Serveur Adaopte API opérationnel !');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});