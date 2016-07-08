var <%=uuid%> = new MVVM.Service({
    pretreatment:function(data,option)<%=pretreatment%>,
    dosuccess:function(data,option)<%=success%>,
    doerror:function(e,error,option)<%=error%>,
    ajaxCall : function(data, option) {
        var self=this;
        appcan.request.ajax({
            url : "<%=url%>",
            type : "<%=method%>",
            data : this.pretreatment(data,option),
            dataType:"<%=datatype%>",
            contentType:"<%=contenttype%>",
            success : function(data) {
                option.success(self.dosuccess(data,option));
            },
            error : function(e, err) {
                option.error(self.doerror(e,err,option));
            }
        });
    }
});