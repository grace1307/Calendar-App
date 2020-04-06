<?php
require 'setup.php';

header("Content-Type: application/json");
set_http_origin();
session_name("CALENDAR_SESSION_ID");
ini_set("session.cookie_httponly", 1);
session_start();

function bail_out() {
  respond_json([ 'isError' => true ]);
  exit;
}

function security_check($trial_token) {
  if (!$_SESSION['user_id'] || !$_SESSION['token'] || !$trial_token || $_SESSION['token'] != $trial_token) {
    bail_out();
  }
}

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

security_check((string)$json_obj['token']);

$event_query = new Event();

$event = $event_query->query([
  'id' => (int)$json_obj['id'],
  'user_id' => $_SESSION['user_id']
]);

if (!count($event)) {
  bail_out();
}

$is_successful = $event_query->update([
  'title' => (string)$json_obj['title'],
  'content' => (string)$json_obj['content'],
  'year' => (string)$json_obj['year'],
  'month' => (string)$json_obj['month'],
  'day' => (string)$json_obj['day'],
  'start_hr' => (string)$json_obj['startHr'],
  'start_min' => (string)$json_obj['startMin'],
  'end_hr' => (string)$json_obj['endHr'],
  'end_min' => (string)$json_obj['endMin'],
  'tag' => (string)$json_obj['tag'],
  'coord' => (string)$json_obj['coord']
], [ 'id' => (int)$json_obj['id'] ]);

$event_query->cleanup();

if (!$is_successful) {
  bail_out();
}

respond_json([
  'id' => (int)$json_obj['id'],
  'title' => htmlentities($json_obj['title']),
  'content' => htmlentities($json_obj['content']),
  'year' => htmlentities($json_obj['year']),
  'month' => htmlentities($json_obj['month']),
  'day' => htmlentities($json_obj['day']),
  'startHr' => htmlentities($json_obj['startHr']),
  'startMin' => htmlentities($json_obj['startMin']),
  'endHr' => htmlentities($json_obj['endHr']),
  'endMin' => htmlentities($json_obj['endMin']),
  'tag' => htmlentities($json_obj['tag']),
  'coord' => htmlentities($json_obj['coord'])
]);

exit;
