<?php
// return the uploaded CSV string as a file, for download by others
$data = urldecode($_POST["html"]);
header("Content-type: text/html");
header("Content-Disposition: attachment; filename=privacytool_rapport.html");

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!-- License for the HTML, JavaScript and CSS source code:

Copyright (c) 2015-2017 Thijs Brentjens, thijs@brentjensgeoict.nl, for Geonovum, the Netherlands.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of Thijs Brentjens nor the names of
      its contributors may be used to endorse or promote products derived
      from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
-->

<!-- License information for the text of the tool:
The text of the tool is licensec under a CC BY 4.0 license, http://creativecommons.org/licenses/by/4.0/
Author: Geonovum, the Netherlands, 2015-2017.
-->
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="nl" lang="nl" dir="ltr">

<head>
    <title>Privacy Tool Oude Persoonsgegevens Nieuwe Doelen</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="http://www.geonovum.nl/sites/default/files/geonovum_favicon.ico" type="image/x-icon" />

    <style type="text/css">
    <?php

    echo file_get_contents('./css/privacytool.css', FILE_USE_INCLUDE_PATH);

    echo file_get_contents('./css/privacytool_report.css', FILE_USE_INCLUDE_PATH);

    ?>
    </style>
</head>
<body>
<h1>Rapport - Privacy Tool Oude Persoonsgegevens Nieuwe Doelen</h1>
<h2>Een diagnosticerend hulpmiddel voor de praktijk bij een voorgenomen nieuw gebruik van reeds verzamelde persoonsgegevens</h2>

<?
echo $data;
?>

</body>
</html>
