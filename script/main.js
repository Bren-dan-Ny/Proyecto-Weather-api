import { obtenerRutaIcono } from "./icons.js";
import { buscarClima } from "./getData.js";

// Capturamos elementos
const btnSearch = document.getElementById("btnSearch");
const searchInput = document.getElementById("searchValue");

const contenidoClima = document.getElementById("contenido-clima");
const estadoError = document.getElementById("estado-error");

const nombreCiudad = document.getElementById("nombre-ciudad");
const fecha = document.getElementById("fecha");
const temperatura = document.getElementById("temperature");
const climaIcon = document.getElementById("icon");
const contenedorDetalles = document.getElementById("contenedor-detalles");
const moldeDetalle = document.getElementById("molde-detalle");
const contenedorDias = document.getElementById("pronostico-dias");

// Funciones de pintado
const agregarElementos = (datos) => {
  nombreCiudad.textContent = `${datos.ubicacion.nombre}, ${datos.ubicacion.pais}`;
  fecha.textContent = datos.fechaActual;
  temperatura.textContent = `${Math.round(datos.actual.temperatura)}°`;
  climaIcon.src = obtenerRutaIcono(datos.actual.codigoClima);
};

const agregarDetalles = (datosActuales) => {
  contenedorDetalles.innerHTML = "";
  const listaDetalles = [
    { label: "Feels Like", value: `${Math.round(datosActuales.sensacion)}°` },
    { label: "Humidity", value: `${datosActuales.humedad}%` },
    { label: "Wind", value: `${datosActuales.viento} mph` },
    { label: "Precipitation", value: `${datosActuales.precipitacion} in` },
  ];
  listaDetalles.forEach((detalle) => {
    const clon = moldeDetalle.content.cloneNode(true);
    clon.querySelector(".detalles-label").textContent = detalle.label;
    clon.querySelector(".detalles-value").textContent = detalle.value;
    contenedorDetalles.appendChild(clon);
  });
};

const agregarPronosticoDiario = (datosDiarios) => {
  contenedorDias.innerHTML = "";
  datosDiarios.diasFechas.forEach((fechaString, posicion) => {
    const fechaObj = new Date(fechaString);
    fechaObj.setMinutes(fechaObj.getMinutes() + fechaObj.getTimezoneOffset());
    const nombreDia = fechaObj.toLocaleDateString("en-EN", {
      weekday: "short",
    });
    const diaOptimizado =
      nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1).replace(".", "");

    const tempMax = Math.round(datosDiarios.diasTempMax[posicion]);
    const tempMin = Math.round(datosDiarios.diasTempMin[posicion]);
    const codigoClima = datosDiarios.diasClimaCodigos[posicion];
    const rutaIcono = obtenerRutaIcono(codigoClima);

    contenedorDias.innerHTML += `
      <div class="daily-card">
        <span class="day-name">${diaOptimizado}</span>
        <img src="${rutaIcono}" alt="Clima" class="icon-daily">
        <div class="temMaxMin">
          <span class="temp-max">${tempMax}°</span>
          <span class="temp-min">${tempMin}°</span>
        </div>
      </div>
    `;
  });
};

const agregarPronosticoHora = (datosHoras) => {
  const contenedorHoras = document.getElementById("pronostico-horas");
  contenedorHoras.innerHTML = "";
  const ahora = new Date();
  let inicio = datosHoras.horasFechas.findIndex((fechaString) => {
    const fechaHora = new Date(fechaString);
    return fechaHora >= ahora;
  });
  if (inicio === -1) inicio = 0;

  for (let i = inicio; i < inicio + 8; i++) {
    if (!datosHoras.horasFechas[i]) break;
    const fechaObj = new Date(datosHoras.horasFechas[i]);
    const horaTexto = fechaObj.toLocaleTimeString("en-EN", {
      hour: "numeric",
      hour12: true,
    });
    const temp = Math.round(datosHoras.horasTemperaturas[i]);
    const codigo = datosHoras.horasClimaCodigos[i];
    const rutaIcono = obtenerRutaIcono(codigo);

    contenedorHoras.innerHTML += `
      <div class="hourly-item">
        <div class="hourly-content">
          <span class="hourly-time">${horaTexto}</span>
          <img src="${rutaIcono}" alt="clima" class="hourly-icon">
        </div>
        <span class="hourly-temp">${temp}°</span>
      </div>
    `;
  }
};

// Funciones de estado
const mostrarError = () => {
  contenidoClima.style.display = "none";
  estadoError.style.display = "flex";
};

const mostrarClima = () => {
  estadoError.style.display = "none";
  contenidoClima.style.display = "grid";
};

// Función de búsqueda
const realizarBusqueda = () => {
  let ciudad = searchInput.value.trim();
  if (ciudad === "") ciudad = "Lima";

  buscarClima(ciudad)
    .then((datos) => {
      agregarElementos(datos);
      agregarDetalles(datos.actual);
      agregarPronosticoDiario(datos.pronosticoDiario);
      agregarPronosticoHora(datos.PronosticoHoras);
      mostrarClima();
      searchInput.value = "";
    })
    .catch((error) => {
      console.error("Error:", error.message);
      mostrarError();
    });
};

// ==========================================
// LÓGICA DEL MENÚ DE UNITS (¡FALTABA ESTO!)
// ==========================================
const btnUnits = document.querySelector(".dropdown-toogle");
const menuUnits = document.querySelector(".dropdown-menu");

if (btnUnits && menuUnits) {
  // Abrir yy Cerrar menú
  btnUnits.addEventListener("click", (e) => {
    e.stopPropagation();
    menuUnits.classList.toggle("show");
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!menuUnits.contains(e.target) && !btnUnits.contains(e.target)) {
      menuUnits.classList.remove("show");
    }
  });

  // Lógica de los checks
  const opcionesMenu = document.querySelectorAll(".menu-section button");
  opcionesMenu.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      e.stopPropagation();
      const seccion = this.closest(".menu-section");
      const botonesDeLaSeccion = seccion.querySelectorAll("button");

      botonesDeLaSeccion.forEach((btn) => {
        const checkExistente = btn.querySelector(".check");
        if (checkExistente) checkExistente.remove();
      });

      const nuevoCheck = document.createElement("span");
      nuevoCheck.className = "check";
      nuevoCheck.innerHTML =
        '<img src="./assets/images/icon-checkmark.svg" alt="check">';
      this.appendChild(nuevoCheck);
    });
  });
} else {
  console.error("No se encontró el botón o el menú de Units");
}

//eventos
btnSearch.addEventListener("click", realizarBusqueda);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") realizarBusqueda();
});

// Carga inicial
realizarBusqueda("Lima");
