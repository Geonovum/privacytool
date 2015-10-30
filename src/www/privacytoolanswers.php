<?php
// return the uploaded JSON string as a file, for download by others
// $jsonData = file_get_contents("php://input"); // $_POST["geojsonContext"];
$jsonData = $_POST["jsonstring"];
header("Content-type: application/json");
// header("Content-Transfer-Encoding: Binary");
// header("Content-Length:".filesize($attachment_location));
header("Content-Disposition: attachment; filename=privacytoolantwoorden.json");
// do some validation...
# $baseUri="http://nieuwsinkaart.nl/rdfgeo/";
echo $jsonData;
?>
