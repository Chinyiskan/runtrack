require("dotenv").config();

const express = require("express");
const cors = require("cors");
const carrerasRoutes = require("./routes/carreras.routes");

const app = express();

// ────────────────────────────────────────────────────────────
//  CORS
//  🚨 OJO — Misión 32: esta lista empieza solo con localhost.
//  Cuando el frontend quede desplegado en Vercel, su URL real
//  se agrega aquí (Checkpoint 3 de la guía).
// ────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500"
        // 👉 agregar aquí la URL de Vercel cuando exista
    ],
}));

app.use(express.json());

// Ruta simple para confirmar que el servidor está vivo
app.get("/", (req, res) => {
    res.json({ mensaje: "RunTrack API funcionando 🏃" });
});

app.use("/carreras", carrerasRoutes);

// 🚨 OJO — Misión 32: nunca un puerto fijo en producción.
// Render asigna su propio puerto por variable de entorno.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("RunTrack backend corriendo en el puerto " + PORT);
});
