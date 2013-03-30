function Tracker() {
	var cap;

	function process() {
		cap.captureContext2d();
	}

	this.init=function() {
		cap = new cam.Capture();
		cap.start(function(cap) {
    		if(cap)
        		process();
		});
	}
	
	this.getCap = function() {
		return cap;
	}
}
