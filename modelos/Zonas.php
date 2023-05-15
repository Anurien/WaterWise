<?php
require_once "../config/conn.php";
//>
class Zonas{
    public function __construct(){


    }

    public function mostrar($idRiego){
        $sql="SELECT * FROM riegos WHERE cod_riego='idRiego'";
        return ejecutarConsultaUnica($sql);
    }
    
    public function listar(){
        $sql="SELECT * FROM riegos";
        return ejecutarConsulta($sql);
    }

}