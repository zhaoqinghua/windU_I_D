var <%=uuid%> = new (MVVM.ViewModel.extend({
  el: "#<%=viewName%>",
  <%if(initialize) {print("initialize:function()");print(initialize);print(",")}%>
  <% if(modelName) {print("model: ");print(modelName);print(",")}%>
  <% if(collectionName) {print("collection: ");print(collectionName);print(",")}%>
}))();