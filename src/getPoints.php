
$id = $_POST['id']
$time = $_POST['time']

$out = array();

foreach (file('/tmp/' . $id) as $line) {
     $arr = json_decode($line);
     if ($arr["time"] > $time) {
     	$out[] = $line;
     }
}

echo json_encode($out);