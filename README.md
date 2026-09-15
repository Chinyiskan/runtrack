# RunTrack 🏃

Bitácora simple de carreras — proyecto de la Misión 32 (Deploy Profesional).

## Qué hace

- Registra carreras: fecha, distancia (km), duración (minutos).
- Calcula el pace (min/km) automáticamente.
- Lista todas las carreras guardadas.

Sin login, sin roles — el foco de esta clase es el deploy, no la lógica.

## Preparación (antes del domingo)

1. Clona este repo.
2. Sigue la guía de Supabase que te llegó por WhatsApp — crea el proyecto y la tabla `carreras`.
3. En `backend/`, copia `.env.example` a `.env` y pon tu URL y clave real de Supabase.
4. En `backend/`: `pnpm install` y luego `pnpm run dev`.
5. Abre `frontend/index.html` con Live Server (puerto 5500).
6. Prueba: registra una carrera y confirma que aparece en la lista.

Si esto funciona en tu máquina, ya estás listo para el domingo — ahí lo desplegamos juntos.

## Estructura

```
runtrack/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── db/conexion.js
│   │   ├── controllers/carreras.controller.js
│   │   └── routes/carreras.routes.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```
