<?php

define("DB_USER", "airbrush");
define("DB_DATABASE", "airbrush");
define("DB_PASS", "JT56U6&J6un");

session_start();

$conn = mysqli_connect("localhost", DB_USER, DB_PASS, DB_DATABASE);

if(isset($_POST['push'])) {
	$user_code = mysql_escape_string($_POST['user_code']);
	$json = mysql_escape_string($_POST['json']);
	$url_code = mysql_escape_string($_POST['push']);
	
	mysqli_query($conn, "DELETE FROM ab_session where url_code = '$url_code' AND user_code = '$user_code'");
	
	$query = "INSERT INTO ab_session 
	            (url_code, user_code, json)
	          VALUES
	            ('$url_code', '$user_code', '$json')";
	            
	if(!mysqli_query($conn, $query))
	{
		echo "{'your mom': 'is a man'}";
	}
}
else if(isset($_GET['pull'])) {
	$url_code = $_GET['pull'];
	
	$query = "SELECT * FROM ab_session WHERE url_code = '";
	$query .= mysql_escape_string($url_code) . "'";
	$rows = mysqli_query($conn, $query);
	
	if(empty($rows))
	{
		return "{}";
	}
	
	$row_arr = Array();
	while($row = mysqli_fetch_array($rows))
	{
		$my_array = '{ "usercode": "' . $row['user_code'] . '",' .
		               '"json":' . $row['json'] . '}';
		
		$row_arr[] = $my_array;
	}
	echo '{"data": [' . implode(",", $row_arr) . ']}';
}

mysqli_close($conn);

?>