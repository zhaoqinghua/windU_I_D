

var <%=uuid%> = new (MVVM.ViewModel.extend({
  el: "#<%=viewName%>",
  <% if(!collectionName){
    print('events:{');
    print(events);
    print('},');
    }%>
  <%if(initialize) {print("initialize:function()");print(initialize);print(",")}%>
  <% if(modelName) {print("model: ");print(modelName);print(",")}%>
  <% if(collectionName) {print("collection: ");print(collectionName);print(",");}%>
  <% if(collectionName) {print("itemView: ");print('MVVM.ViewModel.extend({');
    print('el : $("[data-control=\'CUSTOMLISTVIEW\']>li","#'+viewName+'").prop(\"outerHTML\") || "li",')
    print('events:{');
    print(events);
    print('},');
    print('})');}%>
}))();