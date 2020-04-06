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

$events = $event_query->query([
  'year' => (string)$json_obj['year'],
  'month' => (string)$json_obj['month'],
  'user_id' => $_SESSION['user_id']
]);

$event_query->cleanup();

$results = [];

foreach ($events as $event) {
  $results[] = [
    'id' => (int)$event['id'],
    'title' => htmlentities($event['title']),
    'content' => htmlentities($event['content']),
    'year' => htmlentities($event['year']),
    'month' => htmlentities($event['month']),
    'day' => htmlentities($event['day']),
    'startHr' => htmlentities($event['start_hr']),
    'startMin' => htmlentities($event['start_min']),
    'endHr' => htmlentities($event['end_hr']),
    'endMin' => htmlentities($event['end_min']),
    'tag' => htmlentities($event['tag']),
    'coord' => htmlentities($event['coord'])
  ];
}

respond_json([ 'results' => $results ]);

exit;
