var Model_<%=uuid%> = MVVM.Model.extend({
    <%if(idAttribute) {print("idAttribute:");print(idAttribute);print(",")}%>
    <%if(defaults) {print("defaults:");print(defaults);print(",")}%>
    <%if(computeds) {print("computeds:");print(computeds);print(",")}%>
    sync : function(method, model, options) {
        switch(method) {
        case "create":
            <%if(create) print(create+".request(this.toJSON(), options);")%>
            break;
        case "update":
            <%if(update) print(update+".request(this.toJSON(), options);")%>
            break;
        case "patch":
            <%if(patch) print(patch+".request(options.attrs, options);")%>
            break;
        case "delete":
            <%if(del) print(del+".request(this.toJSON(), options);")%>
            break;
        default:
            break;
        }
    }
})

var <%=uuid%> = new MVVM.Collection({
    <%if(initialize) {print("initialize:function()");print(initialize);print(",")}%>
    <%if(parse) {print("parse:function(data)");print(parse);print(",")}%>
    model:Model_<%=uuid%>,
    sync : function(method, collection, options) {
        switch(method) {
        case "read":
            <%if(read) print(read+".request(options.attrs, options);")%>
            break;
        default:
            break;
        }
    }
})