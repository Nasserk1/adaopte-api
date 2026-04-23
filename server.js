import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Connexion PostgreSQL (Supabase)
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false },
  statement_timeout: 5000,
  query_timeout: 5000,
  connectionTimeoutMillis: 5000
}); // 👈 FERMETURE OBLIGATOIRE

// ===============================
// ROUTE PRINCIPALE : /animaux
// ===============================
app.get("/animaux", async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id,
        a.name,
        a.age,
        a.gender,
        a.description,
        a.imageurl AS imageurl,
        a.size,
        a.good_with_kids,
        a.good_with_animals,
        a.arrival_date,

        b.name AS breed,
        t.name AS type,

        s.name AS shelter,
        s.address,
        s.city,
        s.zip_code,
        s.phone,
        s.email,

        m.vaccinated,
        m.sterilized,
        m.microchipped,
        m.last_checkup,
        m.medical_notes

      FROM animals a
      JOIN breeds b ON a.breed_id = b.id
      JOIN types t ON b.type_id = t.id
      JOIN shelters s ON a.shelter_id = s.id
      LEFT JOIN medicals_infos m ON a.id = m.animal_id
      ORDER BY a.id;
    `;

    const { rows } = await pool.query(query);
    res.json(rows);

  } catch (error) {
    console.error("Erreur API /animaux :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ===============================
// LANCEMENT DU SERVEUR
// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`API en ligne sur le port ${PORT}`);
});
