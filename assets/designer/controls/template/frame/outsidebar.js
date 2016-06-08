var outside_<%=uuid%>=$("#<%=uuid%>"); 
outside_<%=uuid%>.on("touchstart", function(e) {
    e.preventDefault();
});
outside_<%=uuid%>.on("touchmove", function(e) {
    e.stopPropagation();
});
