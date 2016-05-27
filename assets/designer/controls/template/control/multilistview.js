var listview_<%=uuid%> = appcan.listview({
    selector : $("#<%=uuid%>"),
    type : "thickLine",
    hasAngle : <%=hasAngle%> || false,
    hasIcon : <%=hasIcon%> || false,
    align : "<%=align%>" || "left",
    hasRadiobox : <%=hasRadiobox%> || false,
    hasCheckbox : <%=hasCheckbox%> || false,
    hasSubTitle : <%=hasSubTitle%> || false,
    multiLine : <%=multiLine%> || 1,
}); 

listview_<%=uuid%>.set(<%=listdata%>);