<!DOCTYPE html>
<html lang="en">
<?php require_once "header.php"; ?>

<body class="hold-transition sidebar-mini layout-fixed">
    <div class="wrapper">

        <!-- Preloader -->
        <div class="preloader flex-column justify-content-center align-items-center">
            <img class="animation__shake" src="<?php echo $ruta ?>dist/img/AdminLTELogo.png" alt="AdminLTELogo" height="60" width="60">
        </div>

        <!-- Navbar -->
        <?php require_once "nav.php"; ?>
        <!-- /.navbar -->

        <!-- Main Sidebar Container -->
        <?php require_once "menu.php"; ?>

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <section class="content">
                <div class="row">
                    <div class="col-md-12">
                        <div class="box">
                            <div class="box-header with-border">
                                <h1 class="box-title">Mediciones
                                </h1>
                                <div class="box-tools pull-right">
                                </div>
                            </div>
                            <!-- /.box-header -->
                            <!-- centro -->
                            <div class="panel-body table-responsive" id="listadoregistros">
                                <table id="tablalistado" class="table table-striped table-bordered table-condensed table-hover">
                                </table>
                            </div>
                            <div class="card-body" id="formularioregistros">
                                <form name="formulario" id="formulario" method="POST">
                                    <div class="row">
                                        <div class="col-sm-6">

                                            <div class="form-group">
                                                <label>nombre</label>
                                                <input type="hidden" name="idcategoria" id="idcategoria">
                                                <input type="text" class="form-control" name="nombre" id="nombre" placeholder="escribir nombre" required>
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label>descripcion</label>
                                                <input type="text" class="form-control" name="descripcion" id="descripcion" placeholder="escribir descripcion" required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <button class="btn btn-primary" type="submit" id="btnGuardar"><i class="fa fa-save"></i> Guardar</button>

                                        <button class="btn btn-danger" onclick="cancelarformulario()" type="button"><i class="fa fa-arrow-circle-left"></i> Cancelar</button>
                                    </div>
                                </form>
                            </div>
                            <!--Fin centro -->
                        </div><!-- /.box -->
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </section><!-- /.content -->

        </div>
        <!-- ./wrapper -->
        <?php

        require_once "footer.php";

        ?>
        <script type="text/javascript" src="../vistas/codigosjs/mediciones.js"></script>


</body>

</html>