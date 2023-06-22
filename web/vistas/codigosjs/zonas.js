var tabla;

function init(){
mostrarFormulario(false);
listar();
}

function limpiar(){
    $("#cod_riego").val("");
    $("#zona_riego").val("");
    $("#fecha_riego").val("");
}
//Le pasamos un boolean
function mostrarFormulario(x){
    limpiar();
    if(x){
        $("#listadoregistros").hide();
        $("#formularioregistros").show();
        $("#btnGuardar").prop("disabled",false);
        $("#btnAgregar").hide();

    }else{
        $("#listadoregistros").show();
        $("#formularioregistros").hide();
        $("#btnAgregar").show();
    }

}

function cancelarFormulario(){
    limpiar();
    mostrarFormulario(false);
}

function listar(){
 let cols_count = 0;
    tabla=$('#tablalistado').dataTable({
        "aoColumnDefs" : [
            {
                targets   : [cols_count++],
                data      : 'cod_riego',
                title     : 'CODIGO RIEGO',
                width     : "80px",
                visible   : true
            },
            {
                targets   : [cols_count++],
                data      : 'zona_riego',
                title     : 'ZONA',
                width     : "80px",
                visible   : true
            },
            {
                targets   : [cols_count++],
                data      : 'fecha_riego',
                title     : 'FECHA RIEGO',
                width     : "80px",
                visible   : true,
            
            }
        ],
       /* columnDefs: [{
            "defaultContent": "-",
            "targets": "_all"
          }],*/ //pone un - para todos los nulos
        "aProcessing":true,//Activar el procesamiento del datatables
        "aServerSide":true,//Paginacion y filtrado realizados por el servidor
        dom: 'Bfrtip', //Definir los elementos del control de tabla
            buttons:[
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdf'
            ],
            "ajax":
            {
                url:'../ajax/Zonas.php?op=listar',
                type:"get",
                dataType:"json",
                error:function(e){
                    console.log(e.resposeText);
                }
            },
            "bDestroy":true,
            "iDisplayLength":5, //Paginacion
            "order":[[2,"desc"]] //Ordenar

    }).DataTable();
}

init();