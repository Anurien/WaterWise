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
    public function insertar($idMedicion){
        $sql="SELECT * FROM mediciones WHERE cod_medicion='idMediciones'";
        return ejecutarConsultaUnica($sql);
    }
    public function activar($idMedicion){
        $sql="SELECT * FROM mediciones WHERE cod_medicion='idMediciones'";
        return ejecutarConsultaUnica($sql);
    }
    public function desactivar($idMedicion){
        $sql="SELECT * FROM mediciones WHERE cod_medicion='idMediciones'";
        return ejecutarConsultaUnica($sql);
    }
    public function editar($idMedicion){
        $sql="SELECT * FROM mediciones WHERE cod_medicion='idMediciones'";
        return ejecutarConsultaUnica($sql);
    }
    
    public function listar(){
        $sql="SELECT * FROM mediciones";
        return ejecutarConsulta($sql);
    }
    public function listarDHT(){
        $sql="SELECT * FROM mediciones where cod_sensor = 1 or cod_sensor=2";
        return ejecutarConsulta($sql);
    }
    public function listarCAP(){
        $sql="SELECT * FROM mediciones where cod_sensor =5 or cod_sensor=6";
        return ejecutarConsulta($sql);
    }

}