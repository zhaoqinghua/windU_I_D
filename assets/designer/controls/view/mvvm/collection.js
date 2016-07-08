//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/mvvm/collection.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/mvvm/collection.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.model.set("defaults", js_beautify("{  }", 4, " ", 0));
            this.model.set("computeds", "{}");
            this.model.set("idAttribute", "");
            this.model.set("initialize", js_beautify("function(){ return; }", 4, " ", 0));
            this.model.set("parse", js_beautify("function(data){return data;}", 4, " ", 0));
            this.model.set("read", "");
            this.model.set("update", "");
            this.model.set("create", "");
            this.model.set("patch", "");
            this.model.set("del", "");
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
        },{
            type : "textarea",
            title : "集合初始化<br>function initialize()",
            name : "initialize"
        },  {
            type : "select",
            title : "获取集合数据",
            name : "read",
            options : getServices
        },{
            type : "textarea",
            title : "返回数据处理<br>function parse(data)",
            name : "parse"
        },{
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
        },   {
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
