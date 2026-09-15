// ============================================================
//  RunTrack — Frontend
//  Misión 32 · Deploy Profesional
// ============================================================
//  🚨 ESTE ARCHIVO TIENE LOS 2 PUNTOS QUE TOCAN EN CLASE:
//  1. API_URL — apunta a localhost, luego a Render
//  2. Nada más — el resto ya está armado, no lo toquen
// ============================================================

// 🚨 OJO — Checkpoint 2 de la guía.
// Mientras prueban local, esto se queda así.
// Cuando el backend ya esté en Render, cambian este valor
// por la URL real que Render les dio (termina en .onrender.com)
const API_URL = "http://localhost:3000";

const formCarrera = document.getElementById("formCarrera");
const listaCarreras = document.getElementById("listaCarreras");
const mensajeEstado = document.getElementById("mensajeEstado");

// Calcula el pace (min/km) a partir de distancia y duración
function calcularPace(distanciaKm, duracionMinutos) {
    const paceDecimal = duracionMinutos / distanciaKm;
    const minutos = Math.floor(paceDecimal);
    const segundos = Math.round((paceDecimal - minutos) * 60);
    return minutos + ":" + String(segundos).padStart(2, "0") + " /km";
}

// Convierte una carrera en el HTML de su tarjeta
function crearTarjetaCarrera(carrera) {
    const pace = calcularPace(carrera.distancia_km, carrera.duracion_minutos);
    return `
        <div class="tarjeta-carrera">
            <div>
                <strong>${carrera.fecha}</strong><br>
                ${carrera.distancia_km} km en ${carrera.duracion_minutos} min
            </div>
            <div class="pace">${pace}</div>
        </div>
    `;
}

// Pide todas las carreras al backend y las pinta en pantalla
function cargarCarreras() {
    fetch(API_URL + "/carreras")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("El servidor respondió con un error");
            }
            return response.json();
        })
        .then(function (carreras) {
            if (carreras.length === 0) {
                listaCarreras.innerHTML = '<p class="vacio">Todavía no hay carreras registradas.</p>';
                return;
            }
            listaCarreras.innerHTML = carreras.map(crearTarjetaCarrera).join("");
        })
        .catch(function (error) {
            listaCarreras.innerHTML = '<p class="vacio">No se pudo conectar con el servidor.</p>';
            console.error("Error al cargar carreras:", error.message);
        });
}

// Envía una carrera nueva al backend
formCarrera.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nuevaCarrera = {
        fecha: document.getElementById("inputFecha").value,
        distancia_km: Number(document.getElementById("inputDistancia").value),
        duracion_minutos: Number(document.getElementById("inputDuracion").value),
    };

    mensajeEstado.textContent = "Guardando...";

    fetch(API_URL + "/carreras", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaCarrera),
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("No se pudo guardar la carrera");
            }
            return response.json();
        })
        .then(function () {
            mensajeEstado.textContent = "¡Carrera registrada! 🎉";
            formCarrera.reset();
            cargarCarreras();
        })
        .catch(function (error) {
            mensajeEstado.textContent = "Error: " + error.message;
        });
});

// Cargar las carreras apenas se abre la página
cargarCarreras();
