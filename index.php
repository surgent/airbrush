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
   
   	$('#pen-size').css('left', 
   		String($('#display').offset().left + $('#display').width()) + "px");
   	$('#pen-size').css('top',"42px");
   	$('#erase').css('left',
   		String($('#display').offset().left + $('#display').width() + 10) + "px");
   	$('#erase').css('top', "280px");
   	
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

	 		updateCanvas();
      });
      
      	var tolArr = track.getTol();

	$('.config-options .hue > .low').val(tolArr[0]);
	$('.config-options .hue > .high').val(tolArr[1]);
		
	$('.config-options .sat > .low').val(tolArr[2]);
	$('.config-options .sat > .high').val(tolArr[3]);
	 	
	$('.config-options .vib > .low').val(tolArr[4]);
	$('.config-options .vib > .high').val(tolArr[5]);
	
	
	 $('#fullscreen').remove();

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
	 
	 $('#save-config').on('click', function(evt)
	 {
	 	// get the buncha fucking things from 
	 	// the other things
	 	var hl, hh, sl, sh, vl, vh;
	 	hl = $('.config-options .hue .low').val();
	 	hh = $('.config-options .hue .high').val();
	 	
	 	sl = $('.config-options .sat .low').val();
	 	sh = $('.config-options .sat .high').val();
	 	
	 	vl = $('.config-options .vib .low').val();
	 	vh = $('.config-options .vib .high').val();
	 	
	  	console.log(hl);
	  	
	 	track.setTol(hl, hh, sl, sh, vl, vh);
	 	
	 });
	 
	 var i;
	 for(i = 1; i < 6; i++)
	 {
	 	(function()
	 	{
	 	var selector = '#pen-size .size' + String(i);
	 	var j = i;
	 	$(selector).on('click',
	    	function(evt)
	    	{
	    		$('#pen-size .selected').removeClass("selected");
	    		$(selector).addClass("selected");
	    		lineWidth = j;
	    	});
		})();
	  }
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
      
		<div id="pen-size">
			<div class="option size1 selected">
				<div class="text">
				1 pt
				</div>
			</div>
			<div class="option size2">
				<div class="text">
				2 pt
				</div>
			</div>
			<div class="option size3">
				<div class="text">
				3 pt
				</div>
			</div>
			<div class="option size4">
				<div class="text">
				4 pt
				</div>
			</div>
			<div class="option size5">
				<div class="text">
				5 pt
				</div>
			</div>
		</div>
		<div><img id="erase" src="img/eraser.png" onclick="lines=[];"/></div>
   </div>

   <div id="configTool">
      <div class="button close">
         close
         <img src="img/close.png">
      </div>
      <div class="config-options">
	 Tolerance: <br />
	 <div class="range hue">
	 Hue: <br />
	 <input class="low"/>to<input class="high"/>
	 </div>
	 <div class="range sat">
	 Saturation: <br />
	 <input class="low"/>to<input class="high"/>
	 </div>

	 <div class="range vib">
	 Value: <br />
	 <input class="low"/>to<input class="high"/>
	 </div>
	 <div id="save-config" class="bn">
	    save config
	 </div>
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
