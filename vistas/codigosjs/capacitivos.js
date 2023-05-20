var tabla;

function init() {

  charts();

}

function fetchGraph() {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: '../ajax/Mediciones.php?op=graphCAP',
      method: "get",
      dataType: 'json',
      success: function (data) {
        resolve(data);
      },
      error: function (xhr, status, error) {
        reject(error);
      }
    });
  });
}

// Usage


function charts() {
  /* Chart.js Charts */
  // Sales chart
  var capChartCanvas = document.getElementById('cap-chart-canvas').getContext('2d')
  
  fetchGraph()
    .then(function (data) {
      var temperatura = [];
      var hum_aire = [];
      var hum_tierra = [];
      var sensacion_termica = [];
      var fecha_medicion = [];
      let aNuevo = [];

      data.forEach(element => {
        temperatura.push(element['temperatura']);
        hum_aire.push(element['hum_aire']);
        hum_tierra.push(element['hum_tierra']);
        sensacion_termica.push(element['sensacion_termica']);
        fecha_medicion.push(element['fecha_medicion']);
        console.log(element['temperatura']);
        aNuevo = fecha_medicion.slice(fecha_medicion.length - 5)
      });
      //console.log(temperaturas);
    
      var capChartData = {
        labels: aNuevo,
        datasets: [
         {
            label: 'Humedad de la tierra',
            backgroundColor: 'rgba(80,141,180,0.9)',
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bbg',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: hum_tierra
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
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              steps: 10,
              stepValue: 5
          }
          }]
        }
      }

      // This will get the first returned node in the jQuery collection.
      // eslint-disable-next-line no-unused-vars

      var capChart = new Chart(capChartCanvas, { // lgtm[js/unused-local-variable]
        type: 'line',
        data: capChartData,
        options: medicionesChartOptions
      })
    })
    .catch(function (error) {
      // Handle the error here
      console.error(error);
    });

  //console.log(temperatura);
  //console.log(Object.entries(temperatura));
}

init();