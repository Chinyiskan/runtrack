const { supabase } = require("../db/conexion");

// GET /carreras — devuelve todas las carreras registradas, más recientes primero
async function listarCarreras(req, res) {
    try {
        const { data, error } = await supabase
            .from("carreras")
            .select("*")
            .order("fecha", { ascending: false });

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error("Error en GET /carreras:", error.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

// POST /carreras — registra una carrera nueva
async function crearCarrera(req, res) {
    const { fecha, distancia_km, duracion_minutos } = req.body;

    if (!fecha || !distancia_km || !duracion_minutos) {
        return res.status(400).json({ error: "Faltan campos: fecha, distancia_km, duracion_minutos" });
    }

    try {
        const { data, error } = await supabase
            .from("carreras")
            .insert([{ fecha, distancia_km, duracion_minutos }])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (error) {
        console.error("Error en POST /carreras:", error.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

module.exports = { listarCarreras, crearCarrera };
