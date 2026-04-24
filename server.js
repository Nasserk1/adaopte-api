import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.send('API Adaopte en ligne !');
});

// Route pour récupérer les animaux avec les infos de race et type
app.get('/animaux', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('animals')
      .select(`
        *,
        breed:breeds(name),
        type:animal_types(name),
        shelter:shelters(name, city, address, phone, email)
      `);

    if (error) throw error;

    // Mise en forme simple pour le frontend
    const formattedData = data.map(animal => ({
      ...animal,
      breed: animal.breed?.name || 'Inconnue',
      type: animal.type?.name || 'Inconnu',
      shelter: animal.shelter?.name || 'Refuge inconnu',
      city: animal.shelter?.city || 'Ville inconnue'
    }));

    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});