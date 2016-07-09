//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/mvvm/collection.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/mvvm/collection.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            var self = this;
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.model.set("defaults", js_beautify("{  }", 4, " ", 0));
            this.model.set("computeds", "{}");
            this.model.set("idAttribute", "");
            this.model.set("initialize", js_beautify("{ return; }", 4, " ", 0));
            this.model.set("parse", js_beautify("{return data;}", 4, " ", 0));
            this.model.set("read", "");
            this.model.set("update", "");
            this.model.set("create", "");
            this.model.set("patch", "");
            this.model.set("del", "");

            var item_model = MVVM.Model.extend({defaults:{}});
            item_model.prototype.sync = function(method, model, options) {
                var serviceName = self.model.get(method == "delete" ? "del" : method);
                var services = window.desUIEditorMobileViewInstance.getServices();
                _.each(services, function(service) {
                    if (service.get("uuid") == serviceName) {
                        switch(method) {
                        case "patch":
                            service.view.MVVMService.request(options.attrs, options);
                            break;
                        default:
                            service.view.MVVMService.request(model.toJSON(), options);
                            break;
                        }
                    }
                })
            }
            this.MVVMCollection = new MVVM.Collection([],{
                model : item_model
            });
            this.listenTo(this.model, "change:parse", function(data) {
                try {
                    this.MVVMCollection.parse = new Function("data", data.changed.parse);
                } catch(e) {

                }
            });
            this.listenTo(this.model, "change:initialize", function(data) {
                try {
                    this.MVVMCollection.initialize = new Function(data.changed.initialize);
                } catch(e) {

                }
            });
            this.listenTo(this.model, "change:defaults", function(data) {
                try {
                    this.MVVMCollection.model.prototype.defaults = JSON.parse(data.changed.defaults);
                } catch(e) {

                }
            })
            
            this.listenTo(this.model, "change:computeds", function(data) {
                try {
                    var out = js_beautify("var computeds =" + data.changed.computeds , 4, " ", 0);
                    eval(out);
                    this.MVVMCollection.model.prototype.computeds = computeds;
                } catch(e) {
                    $.gritter.add({
                        title : '计算属性设定异常',
                        text : e,
                        class_name : 'gritter-info gritter-center gritter-light'
                    });
                }
            })
            
            this.MVVMCollection.sync = function(method, model, options) {
                var serviceName = self.model.get(method == "delete" ? "del" : method);
                var services = window.desUIEditorMobileViewInstance.getServices();
                _.each(services, function(service) {
                    if (service.get("uuid") == serviceName) {
                        switch(method) {
                        case "read":
                            service.view.MVVMService.request({}, options);
                            break;
                        default:
                            break;
                        }
                    }
                })
            }
            
            this.on("action:read", function() {
                this.MVVMCollection.reset(null);
                this.MVVMCollection.fetch({
                    success : function(model, resp, options) {
                        var v = (_.isObject(resp) ? JSON.stringify(resp) : resp).replace(/</g, "&lt").replace(/>/g, "&gt");
                        $.gritter.add({
                            title : '数据请求成功',
                            text : "",
                            class_name : 'gritter-info gritter-center gritter-light'
                        });
                        self.model.set("result", js_beautify(_.isObject(resp) ? JSON.stringify(resp) : resp, 4, " ", 0));
                    },
                    error : function(model, error, options) {
                        $.gritter.add({
                            title : '数据请求失败',
                            text : error,
                            class_name : 'gritter-info gritter-center gritter-light'
                        });
                    }
                })
            })
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

    function getServices() {
        var services = window.desUIEditorMobileViewInstance.getServices();
        var res = [{
            val : "",
            lab : ""
        }];
        _.each(services, function(service) {
            var item = {
                val : service.get("uuid"),
                lab : service.get("uuid")
            };
            res.push(item);
        })
        return res;
    }

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Collection");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        },
        extOptions : [{
            type : "label",
            title : "集合属性设定:",
            name : "",
        }, {
            type : "textarea",
            title : "集合初始化<br>function initialize()",
            name : "initialize"
        }, {
            type : "select",
            title : "获取集合数据",
            name : "read",
            icon : "fa-cloud-download",
            options : getServices
        }, {
            type : "textarea",
            title : "返回数据处理<br>function parse(data)",
            name : "parse"
        }, {
            type : "text",
            title : "原始返回数据",
            tip : "",
            name : "result"
        }, {
            type : "label",
            title : "集合条目属性设定:",
            name : "",
        }, {
            type : "input",
            title : "索引字段",
            name : "idAttribute"
        }, {
            type : "textarea",
            title : "模型默认值",
            name : "defaults"
        }, {
            type : "textarea",
            title : "模型计算属性",
            tip : "范例:\r\n" + js_beautify('{fullName: function() {return this.get("firstName") +" "+ this.get("lastName");}}', 4, " ", 0),
            name : "computeds"
        }, {
            type : "select",
            title : "新增模型",
            name : "create",
            options : getServices
        }, {
            type : "select",
            title : "更新模型",
            name : "update",
            options : getServices
        }, {
            type : "select",
            title : "部分更新",
            name : "patch",
            options : getServices
        }, {
            type : "select",
            title : "删除模型",
            name : "del",
            options : getServices
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "5f1c90fb-cf68-461b-aaf8-afc0dc0dc888",
        name : "Collection",
        tip : "数据模型集合控件，用于处理数据列表。",
        type : "mvvm",
        icon : "collection.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
