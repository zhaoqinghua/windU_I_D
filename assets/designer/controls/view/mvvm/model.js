//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/mvvm/model.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/mvvm/model.js");
    var syncTemplate = loadTemplate("../assets/designer/controls/template/mvvm/model_sync.js");

    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            var self = this;
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.MVVMModel = new MVVM.Model();
            this.listenTo(this.model, "change:parse", function(data) {
                try {
                    this.MVVMModel.parse = new Function("data", data.changed.parse);
                } catch(e) {

                }
            });
            this.listenTo(this.model, "change:initialize", function(data) {
                try {
                    this.MVVMModel.initialize = new Function(data.changed.initialize);
                } catch(e) {

                }
            });
            this.listenTo(this.model, "change:validate", function(data) {
                try {
                    this.MVVMModel.validate = new Function("attrs", "options", data.changed.validate);
                } catch(e) {

                }
            });
            this.listenTo(this.model, "change:attributes", function(data) {
                try {
                    this.MVVMModel.set(JSON.parse(data.changed.attributes))
                } catch(e) {
                }
            })
            this.listenTo(this.model, "change:computeds", function(data) {
                try {
                    var out = js_beautify("var computeds = " + data.changed.computeds , 4, " ", 0);
                    eval(out);
                    this.MVVMModel.computeds = computeds;
                } catch(e) {
                    $.gritter.add({
                        title : '计算属性设定异常',
                        text : e,
                        class_name : 'gritter-info gritter-center gritter-light'
                    });
                }
            })
            this.MVVMModel.sync = function(method, model, options) {
                var serviceName = self.model.get(method == "delete" ? "del" : method);
                var services = window.desUIEditorMobileViewInstance.getServices();
                _.each(services, function(service) {
                    if (service.get("uuid") == serviceName) {
                        switch(method) {
                        case "patch":
                            service.view.MVVMService.request(options.attrs, options);
                            break;
                        case "read":
                            service.view.MVVMService.request({}, options);
                            break;
                        default:
                            service.view.MVVMService.request(model.toJSON(), options);
                            break;
                        }
                    }
                })
            }

            this.model.set("datas", js_beautify("{  }", 4, " ", 0));
            this.model.set("validate", js_beautify("{ return; }", 4, " ", 0));
            this.model.set("parse", js_beautify("{return data;}", 4, " ", 0));
            this.model.set("initialize", js_beautify("{ return; }", 4, " ", 0));
            this.model.set("computeds", "{}");
            this.model.set("idAttribute", "");
            this.model.set("read", "");
            this.model.set("update", "");
            this.model.set("create", "");
            this.model.set("patch", "");
            this.model.set("del", "");

            this.on("action:read", function() {
                this.MVVMModel.fetch({
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
            this.on("action:update", function() {
                this.MVVMModel.save(JSON.parse(this.model.get("attributes")), {
                    success : function(resp, options) {
                        console.log(resp, options);
                    },
                    error : function(error, options) {
                        console.log(error, options);
                    }
                })
            })
            this.on("action:patch", function() {
                this.MVVMModel.save(JSON.parse(this.model.get("attributes")), {
                    success : function(resp, options) {
                        console.log(resp, options);
                    },
                    error : function(error, options) {
                        console.log(error, options);
                    },
                    patch : true
                })
            })
            this.on("action:create", function() {
                this.MVVMModel.save(JSON.parse(this.model.get("attributes")), {
                    success : function(resp, options) {
                        console.log(resp, options);
                    },
                    error : function(error, options) {
                        console.log(error, options);
                    }
                })
            })
            this.on("action:del", function() {
                this.MVVMModel.destroy({
                    success : function(resp, options) {
                        console.log(resp, options);
                    },
                    error : function(error, options) {
                        console.log(error, options);
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
            this.set("type", "Model");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        },
        extOptions : [{
            type : "input",
            title : "索引字段",
            name : "idAttribute"
        }, {
            type : "textarea",
            title : "默认数据",
            name : "attributes"
        }, {
            type : "textarea",
            title : "初始化 <br>function initialize()",
            name : "initialize"
        }, {
            type : "textarea",
            title : "数据校验 <br>function validate(attrs, options)",
            name : "validate"
        }, {
            type : "textarea",
            title : "返回数据处理<br>function parse(data)",
            name : "parse"
        }, {
            type : "textarea",
            title : "计算属性",
            tip : "范例:\r\n" + js_beautify('{fullName: function() {return this.get("firstName") +" "+ this.get("lastName");}}', 4, " ", 0),
            name : "computeds"
        }, {
            type : "label",
            title : "数据处理服务配置:",
            name : "",
        }, {
            type : "select",
            title : "新增",
            name : "create",
            icon : "fa-cloud-download",
            options : getServices
        }, {
            type : "select",
            title : "更新",
            name : "update",
            icon : "fa-cloud-download",
            options : getServices
        }, {
            type : "select",
            title : "部分更新",
            name : "patch",
            icon : "fa-cloud-download",
            options : getServices
        }, {
            type : "select",
            title : "获取",
            name : "read",
            icon : "fa-cloud-download",
            options : getServices
        }, {
            type : "select",
            title : "删除",
            name : "del",
            icon : "fa-cloud-download",
            options : getServices
        }, {
            type : "text",
            title : "原始返回数据",
            tip : "",
            name : "result"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "7b9676e3-e398-4cf5-ae6f-de31be80613d",
        name : "Model",
        tip : "数据模型控件，用于处理数据。",
        type : "mvvm",
        icon : "model.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
