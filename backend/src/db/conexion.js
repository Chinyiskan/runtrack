// Conexión al cliente de Supabase.
// La URL y la clave viven en variables de entorno — nunca escritas aquí a mano.
// En local vienen del .env. En Render vienen del panel de Environment.

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = { supabase };
