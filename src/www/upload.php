<?php
// return the uploaded JSON string as a file, for download by others
// $jsonData = file_get_contents("php://input"); // $_POST["geojsonContext"];
// header('Content-Type: text/plain; charset=utf-8');
header("Content-type: application/json");

try {
   
    // Undefined | Multiple Files | $_FILES Corruption Attack
    // If this request falls under any of them, treat it invalid.
    if (
        !isset($_FILES['file']['error']) ||
        is_array($_FILES['file']['error'])
    ) {
        throw new RuntimeException('Invalid parameters.');
    }

    // Check $_FILES['file']['error'] value.
    switch ($_FILES['file']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('No file sent.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Exceeded filesize limit.');
        default:
            throw new RuntimeException('Unknown errors.');
    }

    // You should also check filesize here.
    if ($_FILES['file']['size'] > 1000000) {
        throw new RuntimeException('Exceded filesize limit.');
    }

    // DO NOT TRUST $_FILES['file']['mime'] VALUE !!
    // Check MIME Type by yourself.
/*     $finfo = new finfo(FILEINFO_MIME_TYPE);
if (false === $ext = array_search(
        $finfo->file($_FILES['file']['tmp_name']),
        array(
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'json' => 'aplication/json',
        ),
        true
    )) {
        throw new RuntimeException('Invalid file format.');
    }
*/
    // You should name it uniquely.
    // DO NOT USE $_FILES['file']['name'] WITHOUT ANY VALIDATION !!
    // On this example, obtain safe unique name from its binary data.
/*    if (!move_uploaded_file(
        $_FILES['file']['tmp_name'],
        sprintf('./uploads/%s.%s',
            sha1_file($_FILES['file']['tmp_name']),
            $ext
        )
    )) {
        throw new RuntimeException('Failed to move uploaded file.');
    }
*/
    
    $jsondataencoding = json_decode(file_get_contents($_FILES['file']['tmp_name']));
    
    if (!$jsondataencoding) {
        throw new RuntimeException('No valid JSON data input.');
    } 
    echo file_get_contents($_FILES['file']['tmp_name']);
    // echo 'File is uploaded successfully.';

} catch (RuntimeException $e) {

    echo $e->getMessage();

}
// $jsonData = $_POST["jsonstring"];
//header("Content-type: application/json");
// header("Content-Transfer-Encoding: Binary");
// header("Content-Length:".filesize($attachment_location));
// header("Content-Disposition: attachment; filename=privacytoolantwoorden.json");
// do some validation...
// $baseUri="http://nieuwsinkaart.nl/rdfgeo/";
// echo $jsonData;
?>
