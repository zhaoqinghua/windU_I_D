var listview_<%=uuid%> = appcan.listview({
    selector : $("#<%=uuid%>"),
    type : "thinLine",
    hasAngle : <%=hasAngle%> || false,
    hasIcon : <%=hasIcon%> || false,
    align : "<%=align%>" || "left",
    hasRadiobox : <%=hasRadiobox%> || false,
    hasCheckbox : <%=hasCheckbox%> || false,
    hasSubTitle : <%=hasSubTitle%> || false,
    multiLine : <%=multiLine%> || 1,
    hasGroup:true,
}); 

listview_<%=uuid%>.set(<%=listdata%>);