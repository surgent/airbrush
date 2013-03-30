function Tracker() {
	var cap;

	function process() {
		
	}

	this.init=function() {
		cap = new cam.Capture();
		cap.start(function(cap) {
    		if(cap)
        		process();
		});
	}
}
