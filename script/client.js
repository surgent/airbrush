
var Airbrush = Airbrush || {};
Airbrush.Client = {
    
    var lastGetTime = 0;
    var id = "a";
    var partnerId = "b";

    initialize : function(myId, partnerId) {
	this.id = myId;
	this.partnerId = partnerId;
    },

    save : function(point, color, thickness, id) {
	$.post("http://localhost/save.php",
	       data:{
		   point : point,
		   color : color,
		   thickness : thickness,
		   id : this.id
	       });
    },

    get : function(fn) {
	$.post("http://localhost/getPoints.php",
	       data:{
		   id : this.partnerid,
		   time : this.lastGetTime
	       },
	       success : function(data){
		   this.lastGetTime = data.time;
		   fn(data);
	       }
	      );	
    }

};

