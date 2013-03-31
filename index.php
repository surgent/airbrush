<?php
session_start();
	global $sid;
	if(!isset($_SESSION['uid']))
		$_SESSION['uid'] = uniqid();
		
	if(!isset($_GET['u'])) {
		$sid = uniqid();
		header("Location: http://airbrush.surgent.org?u=$sid");
	}
	else
		$sid = $_GET['u'];
?>
<!DOCTYPE html>
<html>
<head>
   <title>
   </title>
   <link rel="stylesheet" type="text/css" href="inc/style.css" ></link>
   <link 
      href='http://fonts.googleapis.com/css?family=Open+Sans:300' 
      rel='stylesheet' 
      type='text/css'>
   <script type="text/javascript" src="script/include.js"></script>
   <script>
   $(window).ready(_main);

   function cancelFullScreen(element) {
       // Supports most browsers and their versions.
       var requestMethod = 
	  element.cancelFullScreen 
	  || element.webkitCancelFullScreen 
	  || element.mozCancelFullScreen 
	  || element.exitFullScreen;

       if (requestMethod) { // Native full screen.
	   requestMethod.call(element);

       } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
	   var wscript = new ActiveXObject("WScript.Shell");
	   if (wscript !== null) {
	       wscript.SendKeys("{Esc}");
	   }
       }
   }

   function requestFullScreen(element) {
       // Supports most browsers and their versions.
       var requestMethod = 
	  element.requestFullScreen 
	  || element.webkitRequestFullScreen 
	  || element.mozRequestFullScreen 
	  || element.msRequestFullScreen;

       if (requestMethod) { // Native full screen.
	   requestMethod.call(element);

       } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
	   var wscript = new ActiveXObject("WScript.Shell");
	   if (wscript !== null) {
	       wscript.SendKeys("{F11}");
	   }
       }
   }

   //var elem = document.body; // Make the body go full screen.
   //requestFullScreen(elem);
   var canvasWidth = 640;
   var canvasHeight = 480;

   function updateCanvas()
   {
      var canvas = $('#display')[0];
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
   }

   function _main(){


      // configure the full screen events
      $(document.body).on('webkitfullscreenchange mozfullscreenchange fullscreenchange',
         fullScreenTrigger);
      updateCanvas();

      $('#configTool').css('left',
         String($('#config').offset().left) + "px");

      $('#fullscreen').on('click', function()
      {
	 var elem = document.body; 

	 requestFullScreen(elem);

	 var availWidth = screen.availWidth;
	 var availHeight = screen.availHeight;

	 canvasWidth = availWidth;
	 canvasHeight = parseInt(availHeight * .6);

	 $('#display').addClass('display-full-screen');
	 $('#fullscreen').remove();

	 updateCanvas();
      });

      $('#config').on('click', function()
	 {
	    // expand tools
	    $('#configTool').css('display', 'block');
	 });

      $('#configTool .button').on('click',
         function(evt)
	 {
	    $('#configTool').css('display', 'none');
	 });
   }

   function fullScreenTrigger(evt)
   {
      // figure out if there is a way to see if it is full screen

   }


   /*
   */

   </script>
</head>
<body>

<div class="side-logo">
airbrush 
</div>

<div id="content">
   <!-- header -->
   <div class='top-bar'>
      <div id="fullscreen">
         full screen
         <img src="img/fullscreen.png" />
      </div>
      <div id="config">
         config 
         <img src="img/config.png" />
      </div>

   </div>
   <div id="content-body">
      <canvas id="display"></canvas>
   </div>

   <div id="configTool">
      <div class="button close">
         close
         <img src="img/close.png">
      </div>
   </div>
</div>
<div style="display: none;" id="sid">
<?php
	global $sid;
	echo $sid;
?>
</div>
<div style="display: none;" id="uid">
<?php
	echo $_SESSION['uid'];
?>
</div>
</body>
</html>
