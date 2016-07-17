$.scrollbox($("body")).on("releaseToReload", function() {//After Release or call reload function,we reset the bounce
    $("#<%=uuid%>").trigger("reload",this);
}).on("onReloading", function(a) {//if onreloading status, drag will trigger this event
    
}).on("dragToReload", function() {//drag over 30% of bounce height,will trigger this event
    
}).on("draging", function(status) {//on draging, this event will be triggered.
    
}).on("release", function() {//on draging, this event will be triggered.
    
}).on("scrollbottom", function() {//on scroll bottom,this event will be triggered.you should get data from server
    
}).reload(); 