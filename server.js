import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Configuration de la connexion via le Transaction Pooler (Port 6543)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

// Route principale synchronisée avec tes tables Supabase
app.get('/animaux', async (req, res) => {
  try {
    // Requête SQL utilisant le nom de table correct "animals" et les jointures
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
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur SQL :', err.message);
    res.status(500).json({ error: 'Erreur de base de données', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('API Adaopte en ligne !');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});