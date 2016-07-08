var <%=uuid%> = new (MVVM.ViewModel.extend({
  el: "#<%=viewName%>",
  events:{
      <%=events%>
  },
  <%if(initialize) {print("initialize:function()");print(initialize);print(",")}%>
  <% if(modelName) {print("model: ");print(modelName);print(",")}%>
  <% if(collectionName) {print("collection: ");print(collectionName);print(",")}%>
}))();