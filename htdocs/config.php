<?php
/* Database credentials */
define('DB_SERVER', 'sql311.infinityfree.com');
define('DB_USERNAME', 'if0_37726471');
define('DB_PASSWORD', 'wZoqg1xjtVU');
define('DB_NAME', 'if0_37726471_hackathon');

define('GOOGLE_CLIENT_ID', '839771400858-chuku4njc30hgii6kqgr5rh5ivg4n826.apps.googleusercontent.com');
define('GOOGLE_CLIENT_SECRET', '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');
define('GOOGLE_REDIRECT_URI', 'https://wesportation.co/callback.php');


/* Attempt to connect to MySQL database */
$link = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
?>
