<?php
require_once "../modelos/Mediciones.php";
 $mediciones = new Mediciones();
 $cod_mediciones =isset($_POST['cod_mediciones'])? limpiarCadena($_POST["cod_mediciones"]):"";
//>
 $cod_sensor =isset($_POST['cod_sensor'])? limpiarCadena($_POST["cod_sensor"]):"";
 $fecha_medicion =isset($_POST['fecha_medicion'])? limpiarCadena($_POST["fecha_medicion"]):"";
 $temperatura =isset($_POST['temperatura'])? limpiarCadena($_POST["temperatura"]):"";
 $hum_aire =isset($_POST['hum_aire'])? limpiarCadena($_POST["hum_aire"]):"";
 $hum_tierra =isset($_POST['hum_tierra'])? limpiarCadena($_POST["hum_tierra"]):"";
 $sensacion_termica =isset($_POST['sensacion_termica'])? limpiarCadena($_POST["sensacion_termica"]):"";

switch($_GET["op"]){
    case "guardareditar":
        if(empty($cod_mediciones)){
            $respuesta =$mediciones->insertar($nombre,$cod_sensor);
            echo $respuesta? "Categoria registrada":"La categoria no se pudo registrar";
        }else{
            $respuesta =$mediciones->editar($cod_mediciones,$fecha_medicion,$cod_sensor);
            echo $respuesta? "Categoria registrada":"La categoria no se pudo registrar";
        }
        break;
    case "desactivar":
        $respuesta =$mediciones->desactivar($cod_mediciones);
        echo $respuesta? "Categoria registrada":"La categoria no se pudo registrar";
        break;
    case "activar":
        $respuesta =$mediciones->activar($cod_mediciones);
        echo $respuesta? "Categoria registrada":"La categoria no se pudo registrar";
         break;
    case "mostrar":
        $respuesta =$mediciones->mostrar($cod_mediciones);
        echo json_encode($respuesta);
        break;
    case "listar":
        $respuesta =$mediciones->listar();
        $data=array();
        
        while($resp=$respuesta->fetch_object()){
            $data[]=array(
                "cod_medicion"=>$resp->cod_medicion,
                "cod_sensor"=>$resp->cod_sensor,
                "fecha_medicion"=>$resp->fecha_medicion,
                "temperatura"=>$resp->temperatura,
                "hum_aire"=>$resp->hum_aire,
                "hum_tierra"=>$resp->hum_tierra,
                "sensacion_termica"=>$resp->sensacion_termica,
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
    case "graphDHT":
         $respuesta =$mediciones->listarDHT();
         $data=array();
        
          while($resp=$respuesta->fetch_assoc()){
                $data[]= $resp;
                
                /*echo '<pre>';
                print_r($resp);
                echo '</pre>';*/
          };
          $result=array(
                "echo"=>1,
                "totalRecords"=>count($data),
                "iTotslRecords"=>count($data),
                "aaData"=>$data
          );
        echo json_encode($data);
         break;
    case "graphCAP":
         $respuesta =$mediciones->listarCAP();
         $data=array();
           
          while($resp=$respuesta->fetch_assoc()){
                   $data[]= $resp;
                   
                   /*echo '<pre>';
                   print_r($resp);
                   echo '</pre>';*/
          };
           $result=array(
                   "echo"=>1,
                   "totalRecords"=>count($data),
                   "iTotslRecords"=>count($data),
                   "aaData"=>$data
             );
        echo json_encode($data);
       break;
}
