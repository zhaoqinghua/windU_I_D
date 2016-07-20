var <%=uuid%> = new MVVM.Service({
    pretreatment:function(data,option)<%=pretreatment%>,
    dosuccess:function(data,option)<%=success%>,
    doerror:function(e,err,option)<%=error%>,
    validate:function(data,option)<%=validate%>,
    ajaxCall : function(data, option) {
        var self=this;
        appcan.request.ajax({
            url : "<%=url%>",
            type : "<%=method%>",
            data : this.pretreatment(data,option),
            dataType:"<%=datatype%>",
            contentType:"<%=contenttype%>",
            success : function(data) {
                var res = self.validate(data, option);
                if (!res)
                    option.success(self.dosuccess(data, option));
                else
                    option.error(self.doerror(data, res, option));
            },
            error : function(e, err) {
                option.error(self.doerror(e,err,option));
            }
        });
    }
});