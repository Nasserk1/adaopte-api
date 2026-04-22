import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function supabaseQuery(table, options = {}) {
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  if (options.select) url += `?select=${options.select}`;
  
  const res = await fetch(url, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    }
  });
  return res.json();
}

app.get("/animaux", async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id,
        a.name,
        a.age,
        a.gender,
        a.description,
        a.imageUrl,
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
        m.microshipped,
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
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


app.post("/sql", async (req, res) => {
  try {
    const { query } = req.body;
    const table = query.match(/FROM\s+(\w+)/i)?.[1];
    if (!table) return res.status(400).json({ error: "Table non trouvée" });
    const data = await supabaseQuery(table);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API en ligne sur le port ${PORT}`);
});