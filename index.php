<?php
  require 'env.php';

  session_name("CALENDAR_SESSION_ID");
  ini_set("session.cookie_httponly", 1);
  session_start();
  $username = @$_SESSION['username'] ?? '';
  $token = @$_SESSION['token'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Calendar</title>
  <link href="https://fonts.googleapis.com/css?family=Dosis:300,400,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="stylesheet.css">
</head>
<body>
  <div class="root"></div>
  <div class="cred credUsername" hidden=""><?php echo $username;?></div>
  <div class="cred credToken" hidden=""><?php echo $token;?></div>
  <script src="controllers/base.js"></script>
  <script src="controllers/login.js"></script>
  <script src="controllers/calendarNav.js"></script>
  <script src="controllers/calendarForm.js"></script>
  <script src="controllers/calendarEvents.js"></script>
  <script src="controllers/calendarChart.js"></script>
  <script src="controllers/calendarHeader.js"></script>
  <script src="controllers/calendarScheduleControl.js"></script>
  <script src="controllers/calendar.js"></script>
  <script src="utils/calendarUtils.js"></script>
  <script src="utils/templates.js"></script>
  <script src="index.js"></script>
  <script async defer src="https://maps.googleapis.com/maps/api/js?key=<?php echo (get_env())['api_key'];?>&callback=setMapReady"></script>
</body>
</html>
