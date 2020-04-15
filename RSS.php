<?php
    header("Content-type:text/xml");
    header("Access-Control-Allow-Origin:*");
	
	$retstr = file_get_contents("wt.xml");
	
	echo $retstr;
	

?>