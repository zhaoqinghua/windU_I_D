var slider_<%=uuid%> = appcan.slider({
    selector : $("#<%=uuid%>"),
    aspectRatio : <%=aspectRatio%> || 6 / 16,
    hasLabel : <%=hasLabel%> || true,
    index : 0
});
slider_<%=uuid%>.set(<%=images%>);
slider_<%=uuid%>.on("clickItem", function(index, data) {
});