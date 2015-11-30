<?php
// return the uploaded JSON string as a file, for download by others
// $jsonData = file_get_contents("php://input"); // $_POST["geojsonContext"];
$data = urldecode($_POST["csv"]);
header("Content-type: text/csv");
// header("Content-Transfer-Encoding: Binary");
// header("Content-Length:".filesize($attachment_location));
header("Content-Disposition: attachment; filename=privacytoolantwoorden.csv");
// do some validation...
# $baseUri="http://nieuwsinkaart.nl/rdfgeo/";
echo $data;
?>
