var treeview_<%=uuid%> = appcan.treeview({
    selector : $("#<%=uuid%>"),
    defaultOpen : 1
});

treeview_<%=uuid%>.set(<%=treedata%>);

treeview_<%=uuid%>.on('listviewClick', function(ele, data, obj) {
});
treeview_<%=uuid%>.on('click', function(ele, obj, subobj) {
});
