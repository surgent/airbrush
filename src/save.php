
$point = $_POST['point']
$color = $_POST['color']
$thickness = $_POST['thickness']
$id = $_POST['id']
$time = time();

$arr = array('point' => $point,
     'color' => $color,
     'thickness' => $thickness,
     'id' => $id,
     'time' => $time);

file_put_contents(/tmp/ . $id, json_encode($arry));