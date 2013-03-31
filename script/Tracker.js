function Tracker() {
	var cap;
	var pbuff;
    var scale = 4;
	var gridSize = 16;
	var grid = [];
	this.onframe = null;
	var _this = this;
	var points = [];
	
	var hsv = [144, 99, 17];
	var tol = [20, 15, 50];

	function findMarker() {
		var p;
		var data = pbuff.data;
		
		var top=[];
		for(var i=0; i<4; ++i)
			top.push({c:0, x:0, y:0});
		
		var gw = grid[0].length;
		var gh = grid.length;
		for(var i=0; i<gh; ++i)
			for(var j=0; j<gw; ++j)
				grid[i][j] = {count:0, x:0, y:0};
		
		for(var y = 0; y < pbuff.height; ++y) {
			for(var x = 0; x < pbuff.width; ++x) {
				var i = y * pbuff.width * 4 + x * 4;
				p = rgb2hsv(data[i], data[i+1], data[i+2]);
			
				if(hsv[0] - tol[0] < p[0] && p[0] < hsv[0] + tol[0] &&
			   		hsv[1] - tol[1] < p[1] && p[1] < hsv[1] + tol[1] &&
			   		hsv[2] - tol[2] < p[2] && p[2] < hsv[2] + tol[2]) {
					data[i] = 255;
					data[i+1] = 255;
			    	data[i+2] = 255;
			    	data[i+3] = 255;
			    
			    	var gx = Math.floor(x/gridSize);
			    	var gy = Math.floor(y/gridSize);
			    	var count = ++grid[gy][gx].count;
			    	
			    	grid[gy][gx].x += x;
			    	grid[gy][gx].y += y;
			    	
			    	for(var n=0; n<top.length; ++n) {
			    		if(count > top[n].c && count > 10) {
			    			if(!(top[n].x == gx && top[n].y == gy)) {
			    				m = top.length - 1;
			    				for(o = m; o > n; --o) {
			    					if(top[o].x == gx && top[o].y == gy) {
			    						m = o;
			    						break;
			    					}
			    				}
			    			
			    				for(; m > n; --m) {
			    					top[m].c = top[m-1].c;
			    					top[m].x = top[m-1].x;
			    					top[m].y = top[m-1].y;
			    				}
			    			}
			    		
			    			top[n].x = gx;
			    			top[n].y = gy;
			    			top[n].c = count;
			    			
			    			break;
			    		}
			    	}
				}
				else {
					data[i] = 0;
					data[i+1] = 0;
					data[i+2] = 0;
					data[i+3] = 255;
				}
			}
		}
		
		var used=[top[0]];
		for(var i=1; i<top.length; ++i) {
			if(top[i].c >= 10 && Math.abs(top[i].x-top[0].x) < 2 && Math.abs(top[i].y - top[0].y) < 2)
				used.push(top[i]);
		}
		var sum = 0;
		var x = 0;
		var y = 0;
		for(var i = 0; i < used.length; ++i) {
			sum += used[i].c;
			x += grid[used[i].y][used[i].x].x;
			y += grid[used[i].y][used[i].x].y;
		}
		x /= sum;
		y /= sum;
		
		points.push({x:scale*x, y:scale*y, mass:sum});
	}

	function sample(buff, x, y) {
		var d = buff.data;
		var o = 4 * buff.width * y + 4 * x;
		
		return [d[o], d[o+1], d[o+2], d[o+3]];
	}

	function color() {
		var size = 4;
		var sx = pbuff.width/2 - size/2;
		var sy = pbuff.height/2 - size/2;
		var ex = sx + size;
		var ey = sy + size;
		var sumr = 0, sumg = 0, sumb = 0;
		for(var y=sy; y < ey; ++y) {
			for(var x=sx; x < ex; ++x) {
				var smp = sample(pbuff, x, y);
				sumr += smp[0];
				sumg += smp[1];
				sumb += smp[2];
			}
		}
		
		szsq = size*size;
		sumr /= szsq;
		sumg /= szsq;
		sumb /= szsq;
		
		var hsv = rgb2hsv(sumr,sumg,sumb);
	}

	function process() {
		pbuff = cap.captureImageData(cap.width() / scale, cap.height() / scale);
		
		findMarker();
		
		if(_this.onframe)
			_this.onframe(cap);
		
		setTimeout(function() {
			window.requestAnimationFrame(process);
			},50
		);
	}

	this.init=function(onstart) {
		cap = new cam.Capture();
		cap.start(function(cap) {
    		if(cap) {
				var gw = Math.ceil(cap.width() / scale / gridSize);
				var gh = Math.ceil(cap.height() / scale / gridSize);
				grid = new Array(gh);
				for(var i=0; i<gw; ++i) {
					grid[i]=new Array(gw);
				}
    			
        		process();
        		
        		if(onstart)
        			onstart(this);
        	}
        	else
        		onstart(null);
		});
	}
	
	this.getCap = function() {
		return cap;
	}
	
	this.getPoints = function() {
		ret = points;
		points = [];
		return ret;
	}
}