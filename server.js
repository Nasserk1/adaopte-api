import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MySQL
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Route : récupérer les animaux
app.get("/animaux", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM animaux");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route : SQL générique (utilisée par le frontend)
app.post("/sql", async (req, res) => {
  try {
    const { query, params } = req.body;
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("API en ligne");
});