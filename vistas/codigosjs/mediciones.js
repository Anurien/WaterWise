var tabla;

function init() {
  mostrarFormulario(false);
  listar();
  charts();

}

function limpiar() {
  $("#cod_medicion").val("");
  $("#cod_sensor").val("");
  $("#fecha_medicion").val("");
  $("#temperatura").val("");
  $("#hum_aire").val("");
  $("#hum_tierra").val("");
  $("#sensacion_termica").val("");
}
//Le pasamos un boolean
function mostrarFormulario(x) {
  limpiar();
  if (x) {
    $("#listadoregistros").hide();
    $("#formularioregistros").show();
    $("#btnGuardar").prop("disabled", false);
    $("#btnAgregar").hide();

  } else {
    $("#listadoregistros").show();
    $("#formularioregistros").hide();
    $("#btnAgregar").show();
  }

}

function cancelarFormulario() {
  limpiar();
  mostrarFormulario(false);
}

function listar() {
  let cols_count = 0;
  tabla = $('#tablalistado').dataTable({
    "aoColumnDefs": [
      {
        targets: [cols_count++],
        data: 'cod_medicion',
        title: 'CODIGO MEDICIÓN',
        width: "80px",
        visible: true
      },
      {
        targets: [cols_count++],
        data: 'cod_sensor',
        title: 'CODIGO SENSOR',
        width: "80px",
        visible: true
      },
      {
        targets: [cols_count++],
        data: 'fecha_medicion',
        title: 'FECHA MEDICIÓN',
        width: "80px",
        visible: true,

      },
      {
        targets: [cols_count++],
        data: 'temperatura',
        title: 'TEMPERATURA',
        width: "80px",
        visible: true
      },
      {
        targets: [cols_count++],
        data: 'hum_aire',
        title: 'HUMEDAD AIRE',
        width: "80px",
        visible: true
      },
      {
        targets: [cols_count++],
        data: 'hum_tierra',
        title: 'HUMEDAD TIERRA',
        width: "80px",
        visible: true
      },
      {
        targets: [cols_count++],
        data: 'sensacion_termica',
        title: 'SENSACIÓN TÉRMICA',
        width: "80px",
        visible: true
      },

    ],
    /* columnDefs: [{
         "defaultContent": "-",
         "targets": "_all"
       }],*/ //pone un - para todos los nulos
    "aProcessing": true,//Activar el procesamiento del datatables
    "aServerSide": true,//Paginacion y filtrado realizados por el servidor
    dom: 'Bfrtip', //Definir los elementos del control de tabla
    buttons: [
      'copyHtml5',
      'excelHtml5',
      'csvHtml5',
      'pdf'
    ],
    "ajax":
    {
      url: '../ajax/Mediciones.php?op=listar',
      type: "get",
      dataType: "json",
      error: function (e) {
        console.log(e.resposeText);
      }
    },
    "bDestroy": true,
    "iDisplayLength": 10, //Paginacion
    "order": [[2, "desc"]] //Ordenar

  }).DataTable();
}
function fetchGraph() {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: '../ajax/Mediciones.php?op=graphDHT',
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
  var medicionesChartCanvas = document.getElementById('mediciones-chart-canvas').getContext('2d')
  //var capChartCanvas = document.getElementById('cap-chart-canvas').getContext('2d')
  // $('#revenue-chart').get(0).getContext('2d');

  /*$.ajax({
    url:"../ajax/Mediciones.php?op=graph",
    method:"get",
    dataType:"JSON",
    success:function(data)
    {
      //console.log(data);
        for(var count = 0; count < data.length; count++)
        data.forEach(element => {
          datos.push(element);
          //console.log(element);
        });
        {
           // temperatura.push(data[count]['temperatura']);
           temperatura.push(count);
            hum_aire.push(data[count]['hum_aire']);
            hum_tierra.push(data[count]['hum_tierra']);
            sensacion_termica.push(data[count]['sensacion_termica']);
            fecha_medicion.push(data[count]['fecha_medicion']);
            //console.log(temperatura);
        }
    }
    
});
*/
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
      var medicionesChartData = {
        labels: aNuevo,
        datasets: [
          {
            label: 'Temperatura',
            backgroundColor: 'rgba(60,101,188,0.9)',
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bbf',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: temperatura
          },
          {
            label: 'Humedad del aire',
            backgroundColor: 'rgba(210, 214, 222, 1)',
            borderColor: 'rgba(210, 214, 222, 1)',
            pointRadius: false,
            pointColor: 'rgba(210, 214, 222, 1)',
            pointStrokeColor: '#c1c7d1',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data: hum_aire
          },
          /*{
            label: 'Humedad de la tierra',
            backgroundColor: 'rgba(80,141,180,0.9)',
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bbg',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: hum_tierra
          },*/
          {
            label: 'Sensacion termica',
            backgroundColor: 'rgba(60,141,100,0.9)',
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bbc',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: sensacion_termica
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
    .catch(function (error) {
      // Handle the error here
      console.error(error);
    });

  //console.log(temperatura);
  //console.log(Object.entries(temperatura));
}

init();