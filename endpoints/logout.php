<?php
require 'setup.php';

header("Content-Type: application/json");
set_http_origin();
session_name("CALENDAR_SESSION_ID");
ini_set("session.cookie_httponly", 1);
session_start();

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

if (!$_SESSION['user_id'] || !$_SESSION['token'] || !$json_obj['token'] || $_SESSION['token'] != $json_obj['token']) {
  echo json_encode([ 'isSuccessful' => false ]);
  exit;
}

session_destroy();

echo json_encode([ 'isSuccessful' => true ]);
exit;
