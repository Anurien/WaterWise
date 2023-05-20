var tabla;

function init(){
charts();

}

function cancelarFormulario(){
    limpiar();
    mostrarFormulario(false);
}


function fetchGraph() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: '../ajax/Mediciones.php?op=graphCAP',
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


fetchGraph()
  .then(function(data) {
    var temperatura =[];
    
    var fecha_medicion  =[];
    let aNuevo= [];

    data.forEach(element => {
      temperatura.push(element['hum_tierra']);
      
      fecha_medicion.push(element['fecha_medicion']);
      aNuevo = fecha_medicion.slice(fecha_medicion.length-5)
    });
    //console.log(temperaturas);
    var medicionesChartData = {
      labels:  aNuevo,
      datasets: [
        {
          label: 'Humedad de la tierra',
          backgroundColor: 'rgba(255, 165, 0, 0.8)', // Orange
          borderColor:'rgba(255, 99, 71, 0.9)', // Tomato 
          pointRadius: false,
          pointColor: '#3b8bbf', // Blue
          pointStrokeColor: 'rgba(255, 165, 0, 1)', // Orange
          pointHighlightFill: '#fff', // White
          pointHighlightStroke: 'rgba(255, 165, 0, 1)', // Orange
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