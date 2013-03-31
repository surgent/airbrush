var track;
var lineWidth;

$(document).ready(function() {

var canvas = $("#display")[0];
var ctx = canvas.getContext("2d");
var cap;
var lines = [];
var yolines = null;
lineWidth = 3;
var down = false;
var sampling = true;
var color = null;

track = new Tracker();
track.init(function() {
	cap = track.getCap();
	canvas.width = cap.width();
	canvas.height = cap.height();
	$(document).on('keydown', function(evt) {
		evt.preventDefault();
	
		if(sampling)
			return;
	
		if(evt.keyCode == 32) {
			if(down)
				return;
				
			track.setTracking(true);
			lines.push([]);
			
			down = true;
		}
	})
	$(document).on('keyup', function(evt) {
		if(evt.keyCode == 32) {
			if(sampling) {
				var hsv = color.hsv;
				track.setColor(hsv[0], hsv[1], hsv[2]);
				sampling = false;
				return;
			}
		
			track.setTracking(false);
			down = false;
		}
	})

	track.onframe=function(cap) {	
		var cx = cap.width() >> 1;
		var cy = cap.height() >> 1;

		ctx.save();
			ctx.fillStyle = "#fff";
			ctx.fillRect(0, 0, cap.width(), cap.height());
			if(!sampling)
				ctx.globalAlpha = 0.2;
			cap.captureContext2d(ctx);
		ctx.restore();

		if(sampling) {
			ctx.save();
				color = track.sampleColor();
				var rgb = color.rgb;
				ctx.strokeStyle = "rgb(" + rgb.join(',') + ")";
				ctx.lineWidth = 2;
				ctx.strokeRect(cx - 49, cy - 49, 98, 98);
				ctx.globalAlpha = 0.5;
				ctx.fillRect(0, 0, canvas.width, cy - 50);
				ctx.fillRect(0, cy-50, cx- 50, 100);
				ctx.fillRect(0, cy+50, canvas.width, cy - 50);
				ctx.fillRect(cx + 50, cy-50, cx- 50, 100);
			ctx.restore();
			
			return;
		}
		
		if(lines.length) {
			var last = lines.length - 1;
			lines[last] = lines[last].concat(track.getPoints());

			for(var line = 0; line < lines.length; ++line) {
				ctx.save();
					ctx.strokeStyle="#09f";
					ctx.lineWidth = lineWidth;
					ctx.beginPath();
			
					if(lines[line].length > 0)
						ctx.moveTo(lines[line][0].x, lines[line][0].y);
				
					for(var i=1; i<lines[line].length; ++i)
						ctx.lineTo(lines[line][i].x, lines[line][i].y);
					
					ctx.stroke();
				ctx.restore();
			}
		}
		
		if(yolines) {
			var _lines=yolines.lines;
			for(var i=0; i<_lines.length; ++i) {
				var pts = _lines[i];
				if(pts.length > 0) {
					ctx.save();
					ctx.lineWidth = yolines.width;
					ctx.beginPath();
					ctx.moveTo(pts[0].x, pts[0].y);
					for(var j=1; j<pts.length; ++j)
						ctx.lineTo(pts[j].x, pts[j].y);
					ctx.stroke();
					ctx.restore();
				}
			}
		}
			
		var loc = track.getLoc();
		ctx.save();
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
			ctx.beginPath();
			ctx.arc(loc.x, loc.y, 8, 0, 2*Math.PI, false);
			ctx.stroke();
		ctx.restore();
	}
});

setInterval(function() {
	var sid = $('#sid').html().replace(/\s*/, "");
	var uid = $('#uid').html().replace(/\s*/, "");
	var json = JSON.stringify({
			lines: lines,
			color: "#000",
			width: lineWidth
		});
	
	var postData = 
		{
			'user_code' : uid,
			'json' : json,
	        'push' : sid
		};
		
	$.post(
		'src/relay.php',
		postData
	);
	
	var getData = { 'pull' : sid };
	$.getJSON(
		'src/relay.php',
		getData,
		function(data)
		{
			var entries = data.data;
			if(entries.length > 1)
			{
				var user1Data = entries[0];
				yolines = (entries[0].usercode != uid)? 
					entries[0].json : entries[1].json;
			}
			else
			{
				yolines = (entries[0].usercode != uid)? entries[0].json : null;
			}
			
		}
	);
},1000);

});