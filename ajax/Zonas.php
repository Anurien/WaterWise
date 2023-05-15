<?php
require_once "../modelos/Zonas.php";
 $zonas = new Zonas();
 $cod_riego =isset($_POST['cod_riego'])? limpiarCadena($_POST["cod_riego"]):"";
//>
 $zona_riego =isset($_POST['zona_riego'])? limpiarCadena($_POST["zona_riego"]):"";
 $fecha_riego =isset($_POST['fecha_riego'])? limpiarCadena($_POST["fecha_riego"]):"";


switch($_GET["op"]){
    case "guardareditar":
        if(empty($cod_mediciones)){
            $respuesta =$zonas->insertar($nombre,$cod_riego);
            echo $respuesta? "Categoria registrada":"La categoria no se pudo registrar";
        }else{
            $respuesta =$zonas->editar($cod_riego,$cod_riego,$fecha_riego);
            echo $respuesta? "Categoria registrada":"La categoria no se pudo registrar";
        }
        break;
    case "desactivar":
        $respuesta =$zonas->desactivar($cod_riego);
        echo $respuesta? "Categoria registrada":"La categoria no se pudo registrar";
        break;
    case "activar":
        $respuesta =$zonas->activar($cod_riego);
        echo $respuesta? "Categoria registrada":"La categoria no se pudo registrar";
         break;
    case "mostrar":
        $respuesta =$zonas->mostrar($cod_riego);
        echo json_encode($respuesta);
        break;
    case "listar":
        $respuesta =$zonas->listar();
        $data=Array();
        
        while($resp=$respuesta->fetch_object()){
            $data[]=array(
                "cod_riego"=>$resp->cod_riego,
                "fecha_riego"=>$resp->fecha_riego,
                "zona_riego"=>$resp->zona_riego,
            );
           /* echo '<pre>';
            print_r($resp);
            echo '</pre>';*/
        };
        $result=array(
            "echo"=>1,
            "totalRecords"=>count($data),
            "iTotslRecords"=>count($data),
            "aaData"=>$data
        );
        echo json_encode($result);
           break;

}