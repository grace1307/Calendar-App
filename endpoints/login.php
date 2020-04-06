<?php
require 'setup.php';

header("Content-Type: application/json");
set_http_origin();

function bail_out() {
  respond_json([
    'isSuccessful' => false,
    'token' => ''
  ]);
  exit;
}

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$trial_username = (string)$json_obj['username'];
$trial_password = (string)$json_obj['password'];

$user_query = new User();
$result = $user_query->query(['username' => $trial_username]);
$user_query->cleanup();

if (!count($result)) {
  bail_out();
}

$user_retrived = $result[0];

if (!password_verify($trial_password, $user_retrived['password'])) {
  bail_out();
}
session_name("CALENDAR_SESSION_ID");
ini_set("session.cookie_httponly", 1);
session_start();
$csrf_token = bin2hex(openssl_random_pseudo_bytes(32));
$_SESSION['username'] = $user_retrived['username'];
$_SESSION['user_id'] = $user_retrived['id'];
$_SESSION['token'] = $csrf_token;

respond_json([
  'isSuccessful' => true,
  'token' => $csrf_token
]);

exit;
