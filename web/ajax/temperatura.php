<?php

//action.php

$connect = new PDO("mysql:host=localhost;dbname=smart_flow", "root", "");

if(isset($_POST["action"]))
{
	if($_POST["action"] == 'fetch')
	{
		$order_column = array('cod_sensor', 'temperatura', 'fecha_medicion');

		$main_query = "
		SELECT cod_sensor, temperatura, fecha_medicion 
		FROM mediciones
		";

		$search_query = 'WHERE fecha_medicion <= "'.date('Y-m-d H:i:s').'" AND (cod_sensor=1 OR cod_sensor=2) AND ';

		if(isset($_POST["start_date"], $_POST["end_date"]) && $_POST["start_date"] != '' && $_POST["end_date"] != '')
		{
			$search_query .= 'fecha_medicion >= "'.$_POST["start_date"].'" AND fecha_medicion <= "'.$_POST["end_date"].'" AND ';
		}

		if(isset($_POST["search"]["value"]))
		{
			$search_query .= '(cod_sensor LIKE "%'.$_POST["search"]["value"].'%" OR temperatura LIKE "%'.$_POST["search"]["value"].'%" OR fecha_medicion LIKE "%'.$_POST["search"]["value"].'%")';
		}



		$group_by_query = " GROUP BY fecha_medicion ";

		$order_by_query = "";

		if(isset($_POST["order"]))
		{
			$order_by_query = 'ORDER BY '.$order_column[$_POST['order']['0']['column']].' '.$_POST['order']['0']['dir'].' ';
		}
		else
		{
			$order_by_query = 'ORDER BY fecha_medicion DESC ';
		}

		$limit_query = '';

		if($_POST["length"] != -1)
		{
			$limit_query = 'LIMIT ' . $_POST['start'] . ', ' . $_POST['length'];
		}

		$statement = $connect->prepare($main_query . $search_query . $group_by_query . $order_by_query);

		$statement->execute();

		$filtered_rows = $statement->rowCount();

		$statement = $connect->prepare($main_query . $group_by_query);

		$statement->execute();

		$total_rows = $statement->rowCount();

		$result = $connect->query($main_query . $search_query . $group_by_query . $order_by_query . $limit_query, PDO::FETCH_ASSOC);

		$data = array();

		foreach($result as $row)
		{
			$sub_array = array();

			$sub_array[] = $row['cod_sensor'];

			$sub_array[] = $row['temperatura'];

			$sub_array[] = $row['fecha_medicion'];

			$data[] = $sub_array;
		}

		$output = array(
			"draw"			=>	intval($_POST["draw"]),
			"recordsTotal"	=>	$total_rows,
			"recordsFiltered" => $filtered_rows,
			"data"			=>	$data
		);

		echo json_encode($output);
	}
}

?>