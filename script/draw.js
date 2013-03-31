$(document).ready(function() {

var canvas = $("#display")[0];
var ctx = canvas.getContext("2d");
var cap;
var lines = [];
var down = false;
var sampling = true;
var color = null;

var track = new Tracker();
track.init(function() {
	cap = track.getCap();
	canvas.width = cap.width();
	canvas.height = cap.height();
	$(document).on('keydown', function(evt) {
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
					ctx.lineWidth = 3;
					ctx.beginPath();
			
					if(lines[line].length > 0)
						ctx.moveTo(lines[line][0].x, lines[line][0].y);
				
					for(var i=1; i<lines[line].length; ++i)
						ctx.lineTo(lines[line][i].x, lines[line][i].y);
					
					ctx.stroke();
				ctx.restore();
			}
		}
			
		var loc = track.getLoc();
		ctx.save();
			ctx.lineWidth = 3;
			ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
			ctx.beginPath();
			ctx.arc(loc.x, loc.y, 8, 0, 2*Math.PI, false);
			ctx.stroke();
		ctx.restore();
	}
});

});