import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js'; // Import corrigé ici
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Sécurité : on vérifie que les clés sont présentes
if (!supabaseUrl || !supabaseKey) {
  console.error("ERREUR : Clés Supabase manquantes dans les variables d'environnement.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.send('API Adaopte en ligne !');
});

// Route principale pour les animaux
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

    // Formatage des données pour le frontend
    const formattedData = data.map(animal => ({
      ...animal,
      breed: animal.breed?.name || 'Inconnue',
      type: animal.type?.name || 'Inconnu',
      shelter: animal.shelter?.name || 'Refuge inconnu',
      city: animal.shelter?.city || 'Ville inconnue'
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Erreur API :", err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});