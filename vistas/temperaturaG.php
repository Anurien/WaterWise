<?php 

//index.php

?>

<!doctype html>
<html lang="en">
<?php require_once "header.php"; ?>
    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Bootstrap CSS -->
        <link href="../library/bootstrap-5/bootstrap.min.css" rel="stylesheet" />
        <link href="../library/dataTables.bootstrap5.min.css" rel="stylesheet" />
        <link href="../library/daterangepicker.css" rel="stylesheet" />

        <script src="../library/jquery.min.js"></script>
        <script src="../library/bootstrap-5/bootstrap.bundle.min.js"></script>
        <script src="../library/moment.min.js"></script>
        <script src="../library/daterangepicker.min.js"></script>
        <script src="../library/Chart.bundle.min.js"></script>
        <script src="../library/jquery.dataTables.min.js"></script>
        <script src="../library/dataTables.bootstrap5.min.js"></script>

    </head>
    <body>
    <?php require_once "menu.php"; ?>
    <?php require_once "nav.php"; ?>

        <div class="container-fluid">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col col-sm-9">Temperatura</div>
                        <div class="col col-sm-3">
                            <input type="text" id="daterange_textbox" class="form-control" readonly />
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <div class="chart-container pie-chart">
                            <canvas id="bar_chart" height="40"> </canvas>
                        </div>
                        <table class="table table-striped table-bordered" id="order_table">
                            <thead>
                                <tr>
                                    <th>Sensor</th>
                                    <th>Temperatura ºC</th>
                                    <th>Fecha de medición</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </body>
    <?php require_once "footer.php"; ?>
</html>

<script>

$(document).ready(function(){

    fetch_data();

    var sale_chart;

    function fetch_data(start_date = '', end_date = '')
    {
        var dataTable = $('#order_table').DataTable({
            "processing" : true,
            "serverSide" : true,
            "order" : [],
            "ajax" : {
                url:"../ajax/temperatura.php",
                type:"POST",
                data:{action:'fetch', start_date:start_date, end_date:end_date}
            },
            "drawCallback" : function(settings)
            {
                var sales_date = [];
                var sale = [];

                for(var count = 0; count < settings.aoData.length; count++)
                {
                    sales_date.push(settings.aoData[count]._aData[2]);
                    sale.push(parseFloat(settings.aoData[count]._aData[1]));
                }

                var chart_data = {
                    labels:sales_date,
                    datasets:[
                        {
                            label : 'Temperatura',
                            backgroundColor : 'rgb(255, 205, 86)',
                            color : '#fff',
                            data:sale
                        }
                    ]   
                };

                var group_chart3 = $('#bar_chart');

                if(sale_chart)
                {
                    sale_chart.destroy();
                }

                sale_chart = new Chart(group_chart3, {
                    type:'bar',
                    data:chart_data,
                
                });
            }
        });
    }

    $('#daterange_textbox').daterangepicker({
        ranges:{
            'Hoy' : [moment(), moment()],
            'Ayer' : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 días' : [moment().subtract(6, 'days'), moment()],
            'Últimos 30 días' : [moment().subtract(29, 'days'), moment()],
            'Este mes' : [moment().startOf('month'), moment().endOf('month')],
            'Mes pasado' : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        format : 'YYYY-MM-DD'
    }, function(start, end){

        $('#order_table').DataTable().destroy();

        fetch_data(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));

    });

});

</script>