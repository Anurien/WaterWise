<?php
require_once "../config/conn.php";
//>
class Mediciones{
    public function __construct(){


    }

    public function mostrar($idMedicion){
        $sql="SELECT * FROM mediciones WHERE cod_medicion='idMediciones'";
        return ejecutarConsultaUnica($sql);
    }
    
    public function listar(){
        $sql="SELECT * FROM mediciones";
        return ejecutarConsulta($sql);
    }

}