# 🚀 RunTrack — Guía de Live Coding, Misión 32 (Deploy Profesional)

**SOLO PARA EL INSTRUCTOR. No se reparte a los estudiantes.**

---

## 0. Qué es esto y cómo está armado

A diferencia de la guía de EventHive (ataque → fix), aquí no hay
vulnerabilidades — hay una **secuencia de deploy con orden obligatorio**.
El hilo conductor de la clase es un problema de huevo-o-gallina real:

> El frontend necesita la URL del backend. El backend necesita la URL
> del frontend (para CORS). Ninguna existe hasta que despliegas la otra.

Toda la clase gira en torno a resolver ese orden, paso por paso, sin
atajos.

**Proyecto:** RunTrack — bitácora de carreras (fecha, distancia, duración,
pace calculado). Sin login, sin roles. Es a propósito así de simple: el
concepto de la clase es *deploy*, no lógica de negocio nueva.

**Stack de hosting:** Render (backend) + Vercel (frontend) + Supabase
(base de datos, ya en la nube).

---

## 1. Preparación ANTES de clase (checklist)

- [ ] Confirma que los estudiantes ya prepararon lo que se les pidió por
  WhatsApp: cuenta en Supabase con la tabla `carreras` creada, cuenta en
  Render y en Vercel (con GitHub), y el proyecto corriendo local sin
  errores.
- [ ] Ten tu propia copia de RunTrack ya funcionando local, con tu propio
  proyecto de Supabase (no compartas tu URL/clave con el grupo — cada
  quien usa la suya).
- [ ] **Despliega tu copia ANTES de la clase, y guarda esa URL aparte.**
  Es tu plan de respaldo si el build en vivo tarda — y con Render además
  es tu forma de tener el servicio ya "despierto" si necesitas mostrar
  algo rápido sin esperar el cold start (ver nota de tiempos abajo).
- [ ] Ten a mano: tu repo en GitHub ya pusheado (sin `.env`), pestaña de
  Render abierta, pestaña de Vercel abierta, pestaña de Supabase abierta
  (tabla `carreras` visible).
- [ ] Verifica que el `.env.example` del repo NO tenga tus credenciales
  reales — solo placeholders.

⏱️ **Nota de tiempos — cold start de Render:** el plan free de Render
"duerme" el backend tras 15 min sin tráfico, y la primera petición
después de eso tarda entre 50 segundos y 1 minuto en responder mientras
despierta. Esto es *distinto* al build inicial (que también tarda un par
de minutos la primera vez que despliegas). Avisa esto a los estudiantes
antes de que crean que algo se rompió — es característico de Render, no
un error de configuración.

---

## 2. Dónde vive cada cosa (ojo con esto)

| Qué | Dónde |
|---|---|
| Puerto dinámico | `backend/src/app.js` — línea de `PORT` |
| CORS (lista de orígenes permitidos) | `backend/src/app.js` — arriba del todo |
| URL del backend que consume el frontend | `frontend/script.js` — constante `API_URL` |
| Variables de entorno reales | Nunca en el código — panel de Render (*Environment*) |

⚠️ **Los estudiantes NO deben tocar** `carreras.controller.js`,
`carreras.routes.js` ni `conexion.js` — esos ya están completos y
funcionando. Si alguien "para probar" les cambia algo ahí, va a romper el
deploy y va a pensar que es un problema de Render. Adviértelo al
principio del ejercicio.

---

## 3. Fases de la clase en vivo (90 min)

### 🎬 00:00–00:07 — Hook (pasivo)

Muestra la infografía/NotebookLM de "funciona en mi máquina" — qué le
falta a un programa para existir en internet (servidor 24/7, variables de
entorno accesibles desde afuera, un dominio público). 5-7 min, sin código
todavía.

---

### 🎥 00:07–00:27 — Demo en vivo (20 min)

Vas a desplegar tu propia copia de RunTrack de principio a fin, en el
orden correcto, dejando que el problema de huevo-o-gallina aparezca en
vivo antes de resolverlo.

**Paso 1 — Deploy del backend a Render (≈6 min)**

- Entra a Render → *New* → *Web Service* → conecta tu repo de GitHub de
  RunTrack.
- En la configuración del servicio, confirma el **Root Directory** en
  `backend` (el repo tiene backend y frontend en carpetas separadas —
  Render necesita saber cuál desplegar).
- Confirma el **Build Command** (`pnpm install`) y el **Start Command**
  (`pnpm start` o `node src/app.js`).
- Ve a la pestaña *Environment* y agrega:
  ```
  SUPABASE_URL=<tu url real>
  SUPABASE_KEY=<tu clave real>
  ```
- Elige el plan **Free** y dale *Create Web Service*. Mientras corre el
  build (puede tardar 1-3 min reales la primera vez — aprovecha para
  explicar qué está pasando: instalando dependencias, arrancando el
  proceso).
- Cuando termine, copia la URL pública que te da Render (algo como
  `https://runtrack-backend.onrender.com`).
- **Pruébala en el navegador directamente** — debe responder
  `{"mensaje": "RunTrack API funcionando 🏃"}`. Este es el primer
  momento fuerte: "esto ya existe para cualquiera en el mundo".

**Paso 2 — El error a propósito: frontend todavía apunta a localhost (≈3 min)**

- Abre tu `frontend/script.js` y muestra que `API_URL` sigue en
  `http://localhost:3000`.
- Pregunta al grupo: "¿Si publico este frontend en Vercel tal cual está,
  va a funcionar?" — deja que digan que no. Esta es la pregunta que
  conecta con el hook del inicio.

**Paso 3 — Actualizar API_URL y deploy del frontend a Vercel (≈6 min)**

- Abre frontend/script.js y cambia la constante API_URL de http://localhost:3000 a la URL real que Render te dio en el Paso 1 (algo como https://runtrack-backend.onrender.com). Después haz commit y push a GitHub.
- Push a GitHub.
- En Vercel: "Add New Project" → selecciona el repo → **Root Directory:
  `frontend`** (mismo detalle que en Render, pero al revés).
- Deploy. Copia la URL de Vercel (`https://runtrack-xxxx.vercel.app`).

**Paso 4 — El segundo error a propósito: CORS bloquea Vercel (≈3 min)**

- Abre la URL de Vercel en el navegador. El formulario carga, pero la
  lista de carreras no aparece — o falla el POST.
- Abre la consola (F12) y muestra el error de CORS explícito: *"blocked
  by CORS policy"*.
- Pregunta: "¿Por qué pasa esto si ya desplegamos los dos?" — conecta con
  lo que vieron en OWASP: el backend solo confía en `localhost:5500`.

**Paso 5 — Arreglar CORS y redeploy (≈2 min)**

- En `backend/src/app.js`, agrega la URL real de Vercel al array de
  `origin`.
- Ejemplo:
```javascript
app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://runtrack-sigma.vercel.app"
    ],
}));
```
- Push a GitHub → Render redeploya solo (*Auto-Deploy* activado por
  defecto).
- Recarga la URL de Vercel → ahora sí carga y guarda carreras.
- Cierre de la demo: "Esto que acaban de ver — en ese orden exacto — es
  lo que van a hacer ustedes ahora con su propio proyecto."

---

### 🧠 00:27–00:37 — Repaso activo (10 min)

Preguntas rápidas, sin código nuevo, para confirmar que el porqué quedó
claro antes de soltarlos a hacerlo solos:

1. "¿Por qué no podemos dejar `app.listen(3000)` a secas?" → Render
   asigna su propio puerto; sin `process.env.PORT` el deploy falla.
2. "¿Por qué el `.env` nunca se sube a GitHub si de todos modos hay que
   poner esos valores en algún lado?" → Render los pide aparte, en su
   panel de *Environment* — el repo público nunca los tiene.
3. "Si yo despliego el frontend ANTES que el backend, ¿qué URL le pongo a
   `API_URL`?" → Ninguna real todavía — por eso el orden importa: backend
   primero.
4. "¿Por qué la primera petición a mi backend después de un rato sin usarlo
   tarda casi un minuto en responder?" → El plan free de Render duerme el
   servicio tras 15 min de inactividad; la primera petición lo despierta.
5. Snippet con error — muéstrales esto y pregunta qué va a pasar:
   ```javascript
   app.listen(3000, () => {
       console.log("Servidor arriba");
   });
   ```
   Respuesta esperada: en Render el proceso no va a recibir tráfico
   correctamente, porque Render espera que el proceso escuche en el
   puerto que él asigna, no en el 3000 fijo.

---

### 🛠️ 00:37–01:12 — Ejercicio en clase (35 min)

Cada estudiante despliega SU PROPIA copia de RunTrack (la que prepararon
en la semana, con su propio proyecto de Supabase) siguiendo exactamente
la secuencia de la demo. No programan nada nuevo — el ejercicio es 100%
deploy.

**Checkpoint 1 — Backend en Render**
Deploy del repo (Root Directory `backend`), variables de entorno
(`SUPABASE_URL`, `SUPABASE_KEY`) puestas en *Environment*, confirmar que
la URL pública responde el mensaje de bienvenida.

**Checkpoint 2 — Actualizar API_URL**
Cambiar la constante en `frontend/script.js` por la URL real de su
Render (`https://xxxx.onrender.com`), hacer commit y push.

**Checkpoint 3 — Frontend en Vercel**
Deploy del frontend (Root Directory `frontend`), confirmar que la página
carga (aunque todavía no traiga datos).

**Checkpoint 4 — CORS + redeploy + prueba end-to-end**
Agregar su URL de Vercel al `origin` del backend, push, esperar el
redeploy automático de Render, y probar: registrar una carrera desde la
URL pública de Vercel y verla aparecer en la lista.

Quien termina los 4 checkpoints antes de tiempo: que pruebe abrir su URL
de Vercel desde el celular (con datos móviles, no wifi del salón) — la
prueba más real de que "esto ya es internet de verdad". Bonus: que
espere a que su backend se "duerma" (o lo pruebe después de la clase) y
sienta el cold start en carne propia.

---

## 4. Cierre (últimos minutos del colchón)

> "Lo que acaban de hacer es lo que hace cualquier desarrollador junior
> el primer día en una empresa: tomar código que ya existe y ponerlo a
> vivir en un servidor real. La próxima clase le metemos login a esto
> mismo, ya en producción."

---

## 5. 🧯 Colchón / Troubleshooting

- **Render despliega pero la URL pública da error 502 o "Application
  failed to respond":** casi siempre es el puerto fijo (`3000` en vez de
  `process.env.PORT`), o falta alguna variable de entorno. Revisa los
  *Logs* del servicio en Render — ahí sale el error real de arranque.
- **La primera petición tarda casi un minuto y el estudiante piensa que
  está roto:** es el cold start del plan free (ver nota de tiempos en la
  Sección 1). No es un error — solo hay que esperarlo la primera vez.
- **Vercel despliega pero la página se ve en blanco:** revisa que el
  *Root Directory* en Vercel esté en `frontend`, no en la raíz del repo
  (si el repo tiene backend y frontend juntos, Vercel por defecto intenta
  la raíz).
- **CORS sigue bloqueando después del fix:** confirma que la URL en el
  array de `origin` es EXACTA — sin `/` al final, con `https://`
  completo. Un solo carácter distinto y el navegador la rechaza.
- **"Estudiante cambió algo en `carreras.controller.js` y ahora nada
  funciona":** pídele que compare contra el repo original — lo más rápido
  es que vuelva a clonar limpio y solo repita el cambio de `API_URL` y
  CORS, sin tocar el resto.
- **El build en Render tarda mucho (>3 min):** es normal, sobre todo en
  el plan free. Usa este tiempo muerto para adelantar explicación del
  siguiente checkpoint en vez de esperar en silencio.
- **Alguien no tiene cuenta de Render/Vercel lista (no lo preparó en la
  semana):** que se loguee con GitHub en el momento — tarda menos de un
  minuto, pero adviértelo para que no se atrase del grupo.
