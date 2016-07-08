var <%=uuid%> = new (MVVM.Model.extend({
    <%if(idAttribute) {print("idAttribute:");print(idAttribute);print(",")}%>
    <%if(attributes) {print("defaults:");print(attributes);print(",")}%>
    <%if(initialize) {print("initialize:function()");print(initialize);print(",")}%>
    <%if(parse) {print("parse:function(data)");print(parse);print(",")}%>
    <%if(validate) {print("validate:function(attrs, options)");print(validate);print(",")}%>
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
            case "read":
                <%if(read) print(read+".request({}, options);")%>
                break;
            case "delete":
                <%if(del) print(del+".request(this.toJSON(), options);")%>
                break;
            default:
                break;
        }
    }
}))()
