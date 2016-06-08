var mask_<%=uuid%>=$("#<%=uuid%>");
mask_<%=uuid%>.on("touchstart", function(e) {
    e.preventDefault();
});
mask_<%=uuid%>.on("touchmove", function(e) {
    e.stopPropagation();
});
mask_<%=uuid%>.on("tap", function(e) {
    $(e.target).removeClass("show");
    setTimeout(function() {
        $(e.target).removeClass("active");
    }, 300)
}); 

mask_<%=uuid%>.show=function(){
    var self=this;
    self.addClass("active");
    setTimeout(function() {
        self.addClass("show");
    }, 1);
}
