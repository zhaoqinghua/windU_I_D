//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/mvvm/service.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/mvvm/service.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            var self = this;
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.MVVMService = new MVVM.Service({});
            this.MVVMService.ajaxCall = function(data, option) {
                var service = this;
                appcan.request.ajax({
                    url : self.model.get("url"),
                    type : self.model.get("method"),
                    data : service.pretreatment ? service.pretreatment(data, option) : data,
                    dataType : self.model.get("datatype"),
                    contentType : self.model.get("contenttype"),
                    success : function(data) {
                        option.success(service.dosuccess ? service.dosuccess(data, option) : data);
                    },
                    error : function(e, err) {
                        option.error(service.doerror ? service.doerror(e, err, option) : err,e,option);
                    }
                });
            }
            this.listenTo(this.model, "change:pretreatment", function(data) {
                try {
                    this.MVVMService.pretreatment = new Function("data", data.changed.pretreatment);
                } catch(e) {

                }
            });
            this.listenTo(this.model, "change:success", function(data) {
                try {
                    this.MVVMService.dosuccess = new Function("data", data.changed.success);
                } catch(e) {

                }
            });
            this.listenTo(this.model, "change:error", function(data) {
                try {
                    this.MVVMService.doerror = new Function("e","err","options", data.changed.error);
                } catch(e) {

                }
            });
            this.model.set("pretreatment", js_beautify("{ return data; }", 4, " ", 0));
            this.model.set("success", js_beautify("{ return data; }", 4, " ", 0));
            this.model.set("error", js_beautify("{ return err; }", 4, " ", 0));
            this.model.set("method", "GET");
            this.model.set("url", "");
            this.model.set("datatype", "");
            this.model.set("contenttype", "application/x-www-form-urlencoded");
        },
        template : Template, //VIEW对应的模板
        jsTemplate : jsTemplate,
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                Backbone.Designer.View.prototype.render.apply(this, arguments);
            }
            return this;
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function(options) {
            this.set("type", "Service");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        },
        extOptions : [{
            type : "select",
            title : "方法",
            name : "method",
            options : [{
                val : "GET",
                lab : "GET"
            }, {
                val : "POST",
                lab : "POST"
            }, {
                val : "PUT",
                lab : "PUT"
            }, {
                val : "DELETE",
                lab : "DELETE"
            }]
        }, {
            type : "select",
            title : "提交类型",
            name : "contenttype",
            options : [{
                val : "application/json",
                lab : "application/json"
            }, {
                val : "application/x-www-form-urlencoded",
                lab : "application/x-www-form-urlencoded"
            }, {
                val : "multipart/form-data",
                lab : "multipart/form-data"
            }]
        }, {
            type : "select",
            title : "响应类型",
            name : "datatype",
            options : [{
                val : "json",
                lab : "json"
            }, {
                val : "xml",
                lab : "xml"
            }, {
                val : "html",
                lab : "html"
            }]
        }, {
            type : "input",
            title : "API URL",
            name : "url"
        }, {
            type : "textarea",
            title : "发送数据预处理函数<BR>function(data,option)",
            name : "pretreatment"
        }, {
            type : "textarea",
            title : "响应处理函数<br>function(data,option)",
            name : "success"
        }, {
            type : "textarea",
            title : "异常处理函数<br>function(e,err,option)",
            name : "error"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "13862067-38ec-4aa9-bfa7-ac958b1f508c",
        name : "Service",
        tip : "数据服务控件，用于处理与后端接口对接。",
        type : "mvvm",
        icon : "service.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
