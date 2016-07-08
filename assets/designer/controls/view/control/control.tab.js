jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/tab.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/control/tab.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change", function(data) {
                this.update();
            })
            this.on("update", this.update);
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
        },
        template : Template, //VIEW对应的模板
        render : function() {
            this.$el = $(this.template(this.model.toJSON()));
            Backbone.Designer.View.prototype.render.apply(this, arguments);
            this.trigger("update", {});
            return this;
        },
        update : function() {
            var extOptions = this.model.toJSON();
            var $tab = $(this.$el);
            try {
                if (this.tabview)
                    this.tabview.ele.empty();
                var labels = (extOptions.lables || "").split(",");
                var icons = (extOptions.icons || "").split(",");
                var data = [];
                for (var i = 0; i < labels.length; i++) {
                    data.push({
                        label : labels[i],
                        icon : icons[i]
                    });
                }
                this.tabview = appcan.tab({
                    selector : $tab,
                    hasIcon : extOptions.hasIcon,
                    hasAnim : extOptions.hasAnim,
                    hasLabel : extOptions.hasLabel,
                    hasBadge : extOptions.hasBadge,
                    index : extOptions.index,
                    data : data
                });
            } catch(e) {

            }
        },
        buildJS : function() {
            var extOptions = this.model.toJSON();
            var labels = (extOptions.lables || "").split(",");
            var icons = (extOptions.icons || "").split(",");
            var data = [];
            for (var i = 0; i < labels.length; i++) {
                data.push({
                    label : labels[i],
                    icon : icons[i]
                });
            }
            extOptions.data = JSON.stringify(data);
            return jsTemplate(extOptions);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function(options) {
            this.set("type", "Tab");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("hasLabel", true);
            this.set("hasAnim", false);
            this.set("hasBadge", false);
            this.set("hasIcon", true);
            this.set("index", 0);
            this.set("lables", "首页,个人,分类,搜索");
            this.set("icons", "fa-home,fa-user,fa-list,fa-search");
            this.set("dep", "appcan.tab.js");
        },
        extOptions : [{
            type : "checkbox",
            title : "是否有图标",
            name : "hasIcon"
        }, {
            type : "checkbox",
            title : "是否有焦点变更动画",
            name : "hasAnim"
        }, {
            type : "checkbox",
            title : "是否有文子标签",
            name : "hasLabel"
        }, {
            type : "checkbox",
            title : "是否有角标",
            name : "hasBadge"
        }, {
            type : "input",
            title : "焦点索引",
            name : "index"
        }, {
            type : "input",
            title : "标签",
            name : "lables"
        }, {
            type : "icon",
            title : "图标",
            name : "icons"
        }, {
            type : "select",
            title : "数据模型",
            name : "model",
            options : mvvm.getModels
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "6e3fb9c5-b3dd-44aa-b0e2-3ba94973c2cd",
        name : "Tab",
        tip : "多页标签控件，用于界面内分页导航。常与Pane控件联动",
        icon : "Tab.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
