<?php
// return the uploaded CSV string as a file, for download by others
$data = urldecode($_POST["csv"]);
header("Content-type: text/csv");
header("Content-Disposition: attachment; filename=privacytoolantwoorden.csv");

echo $data;
?>
