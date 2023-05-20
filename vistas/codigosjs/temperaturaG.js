var tabla;

function init(){
charts();
}

function cancelarFormulario(){
    limpiar();
    mostrarFormulario(false);
}
function aplicarFiltro(startDate, endDate) {
    // Convertir las fechas al formato requerido por la base de datos (puede variar según tu configuración)
    const fechaInicio = startDate.format('YYYY-MM-DD');
    const fechaFin = endDate.format('YYYY-MM-DD');
  
    // Realizar una solicitud a la base de datos para obtener los datos correspondientes al rango de fechas
  
    // Ejemplo utilizando jQuery.ajax
    $.ajax({
      url: '../ajax/Mediciones.php?op=graphDHT', 
      method: "get",
      data: {
        startDate: fechaInicio,
        endDate: fechaFin
      },
      success: function(response) {
        const datosFiltrados = response; 
        actualizarGrafica(datosFiltrados);
      },
      error: function(error) {
        console.error('Error al obtener los datos de la base de datos:', error);
      }
    });
  }

function actualizarGrafica(datosFiltrados) {
    // Obtener el contexto del lienzo de la gráfica
    const canvas = document.getElementById('miGrafica');
    const ctx = canvas.getContext('2d');
  
    // Limpiar el lienzo de la gráfica
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Crear la nueva instancia de la gráfica con los datos filtrados
    const nuevaGrafica = new Chart(ctx, {
      type: 'line',
      data: {
        // Configurar los datos filtrados en el formato requerido por Chart.js
        labels: datosFiltrados.map(item => item.label),
        datasets: [
          {
            data: datosFiltrados.map(item => item.value),
            label: 'Humedad ambiente',
            backgroundColor: 'rgba(102, 204, 255, 0.9)', // Light Blue (relating to humidity)
            borderColor: 'rgba(51, 153, 255, 0.8)', // Blue (relating to humidity)
            pointRadius: false,
            pointColor: '#3b8bbf', // Blue
            pointStrokeColor: 'rgba(51, 153, 255, 1)', // Blue (relating to humidity)
            pointHighlightFill: '#fff', // White
            pointHighlightStroke: 'rgba(51, 153, 255, 1)', // Blue (relating to humidity)
          }
        ]
      },
      options: {
        // Configurar las opciones de la gráfica según sea necesario
        // (por ejemplo, ejes, leyenda, animaciones, etc.)
      }
    });
  }


function fetchGraph() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: '../ajax/Mediciones.php?op=graphDHT',
      method: "get",
      dataType: 'json',
      success: function(data) {
        resolve(data);
      },
      error: function(xhr, status, error) {
        reject(error); 
      }
    });
  });
}

// Usage


function charts(){
     /* Chart.js Charts */
  // Sales chart
  var medicionesChartCanvas = document.getElementById('mediciones-chart-canvas').getContext('2d')
  $('.daterange').daterangepicker({
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    startDate: moment().subtract(29, 'days'),
    endDate: moment()
  }, function (start, end) {
    // eslint-disable-next-line no-alert
     aplicarFiltro(start, end);
  })

fetchGraph()
  .then(function(data) {
    var temperatura =[];
    
    var fecha_medicion  =[];
    let aNuevo= [];

    data.forEach(element => {
      temperatura.push(element['temperatura']);
      
      fecha_medicion.push(element['fecha_medicion']);
      console.log(element['temperatura']);
      aNuevo = fecha_medicion.slice(fecha_medicion.length-5)
    });
    //console.log(temperaturas);
    var medicionesChartData = {
      labels:  aNuevo,
      datasets: [
        {
          label: 'Temperatura',
          fill: false,
          borderWidth: 2,
          lineTension: 0,
          spanGaps: true,
          borderColor:'rgba(255, 99, 71, 0.9)', // Tomato 
          pointRadius: 3,
          pointHoverRadius: 7,
          pointColor: 'rgba(255, 99, 71, 0.9)', // Blue
          pointStrokeColor: 'rgba(255, 165, 0, 1)', // Orange
          data: temperatura
        }
      ]
    }
  
    var medicionesChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            color: '#efefef',
            drawBorder: false
          },
          ticks: {
            fontColor: '#efefef'
        }
        }],
        yAxes: [{
          gridLines: {
            display: true,
            color: '#efefef',
            drawBorder: false
          },
          ticks: {
            beginAtZero: true,
            steps: 10,
            stepValue: 5,
            fontColor: '#efefef'
        }
        }]
      }
    }
  
    // This will get the first returned node in the jQuery collection.
    // eslint-disable-next-line no-unused-vars
    var medicionesChart = new Chart(medicionesChartCanvas, { // lgtm[js/unused-local-variable]
      type: 'line',
      data: medicionesChartData,
      options: medicionesChartOptions
    })
    ///
  })
  .catch(function(error) {
    // Handle the error here
    console.error(error);
  });

//console.log(temperatura);
//console.log(Object.entries(temperatura));
}

init();