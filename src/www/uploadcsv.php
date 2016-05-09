<?php
// return the uploaded CSV string as a file, for download by others
header("Content-type: text/csv");

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

    // Check filesize
    if ($_FILES['file']['size'] > 1000000) {
        throw new RuntimeException('Exceded filesize limit.');
    }

    echo file_get_contents($_FILES['file']['tmp_name']);

} catch (RuntimeException $e) {
    echo $e->getMessage();
}
?>
