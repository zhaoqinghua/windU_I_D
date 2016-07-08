{
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