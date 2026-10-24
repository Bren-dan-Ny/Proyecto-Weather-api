export const buscarClima = (ciudad) => {
  let datosUbicacion = {};

  const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${ciudad}&count=1&language=es`;

  return fetch(urlGeocoding)
    .then((response) => {
      return response.json();
    })
    .then((dataGeo) => {
      console.log(dataGeo);

      //usar el if en el momento para mostrar la pagina de "no se encontro resultados"
      // if(!dataGeo.results || dataGeo.results.length === 0){
      //     console.log("no se encontro la ciudad")
      // }

      //llamamos las coordenadas del primer resultado
      // para traer los datos del clima de la api
      datosUbicacion = {
        pais: dataGeo.results[0].country,
        nombre: dataGeo.results[0].name,
      };
      const latitud = dataGeo.results[0].latitude;
      const longitud = dataGeo.results[0].longitude;

      //peticion del Clima usando las coordenadas
      const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`;

      return fetch(urlClima);
    })
    .then((responseClima) => {
      return responseClima.json();
    })
    .then((dataClima) => {
      console.log(dataClima);

      const fechaApi = new Date(dataClima.current.time);
      const opcionesFecha = {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const fechaformateada = fechaApi.toLocaleDateString(
        "en-EN",
        opcionesFecha,
      );
      const fecha =
        fechaformateada.charAt(0).toUpperCase() + fechaformateada.slice(1);

      return {
        ubicacion: datosUbicacion,
        fechaActual: fecha,
        actual: {
          temperatura: dataClima.current.temperature_2m,
          sensacion: dataClima.current.apparent_temperature,
          humedad: dataClima.current.relative_humidity_2m,
          viento: dataClima.current.wind_speed_10m,
          precipitacion: dataClima.current.precipitation,
          codigoClima: dataClima.current.weather_code,
        },
        pronosticoDiario: {
          diasFechas: dataClima.daily.time,
          diasTempMax: dataClima.daily.temperature_2m_max,
          diasTempMin: dataClima.daily.temperature_2m_min,
          diasClimaCodigos: dataClima.daily.weather_code,
        },
        PronosticoHoras: {
          horasFechas: dataClima.hourly.time,
          horasTemperaturas: dataClima.hourly.temperature_2m,
          horasClimaCodigos: dataClima.hourly.weather_code,
        },
      };
    });
};
