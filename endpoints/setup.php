<?php
require 'base.php';

function set_http_origin() {
  $http_origin = $_SERVER['HTTP_ORIGIN'];
  $env = get_env();

  if (in_array($http_origin, $env['http_origins'] ?? [])) {
    header("Access-Control-Allow-Origin: $http_origin");
    header("Access-Control-Allow-Credentials: true");
  } else {
    header("Access-Control-Allow-Origin: null");
  }
}
?>