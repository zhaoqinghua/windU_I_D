jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/treeview.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/control/treeview.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.render();
            this.listenTo(this.model, "change", function() {
                this.update();
            })
            this.listenTo(this.model, "change:treedata", function() {
                var data = JSON.parse(this.model.get("treedata"));
                this.$tv.set(data);
            })
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
        },
        template : Template, //VIEW对应的模板
        jsTemplate : jsTemplate, //VIEW对应的JS模板
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                Backbone.Designer.View.prototype.render.apply(this, arguments);
                this.update();
            }
            return this;
        },
        update : function() {
            var extOptions = this.model.toJSON();
            var $treeview = $(this.$el);
            try {
                if (this.$tv) {
                    this.$tv.ele.empty();
                    delete this.$tv;
                }
                this.$tv = appcan.treeview({
                    selector : $treeview,
                    defaultOpen : 1//默认打开第几项，必须包含数据
                });
                var data = JSON.parse(this.model.get("treedata"));
                this.$tv.set(data);
            } catch(e) {

            }
        },
        appendChild : function(el,dom) {
            $(dom || this.$el).append(el);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "TreeView");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("size_h", "70");
            this.set("dep", "appcan.treeview.js"); 
            this.set("treedata", JSONProcess(JSON.stringify([{
                header : "LEVEL 1 - 0",
                name : "ITEM",
                url : ""
            }, {
                header : "LEVEL 1 - 1",
                name : "ITEM",
                url : ""
            }, {
                header : "LEVEL 1 - 2",
                content : [{
                    title : 'LEVEL 2 - 0',
                    name : "listview",
                }, {
                    title : 'LEVEL 2 - 1',
                    name : "listview",
                }]
            }])))
            
        },
        extOptions : [{
            type : "textarea",
            title : "Tree Data",
            name : "treedata"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "4316c818-6417-47bf-a370-c58cac0b13d4",
        name : "TreeView",
        tip : "二级树控件，支持二级列表折叠",
        icon : "Treeview.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
