jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/tab.html");
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
            var $tab = $("#" + extOptions.uuid, this.$el);
            try {
                if (this.tabview)
                    this.tabview.ele.empty();
                var labels = (extOptions.lables || "").split(",");
                var icons = (extOptions.icons || "").split(",");
                var data = [];
                for (var i = 0; i < labels.length ; i++) {
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
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function(options) {
            this.set("type", "Tab");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            if (!options) {
                this.set("hasLabel", true);
                this.set("hasAnim", false);
                this.set("hasBadge", false);
                this.set("hasIcon", true);
                this.set("index", 0);
                this.set("lables", "首页,个人,分类,搜索");
                this.set("icons", "fa-home,fa-user,fa-list,fa-search");
            }
        },
        extOptions : [{
            type : "checkbox",
            title : "Has Icon",
            name : "hasIcon"
        }, {
            type : "checkbox",
            title : "Has Animiation",
            name : "hasAnim"
        }, {
            type : "checkbox",
            title : "Has Label",
            name : "hasLabel"
        }, {
            type : "checkbox",
            title : "Has Badge",
            name : "hasBadge"
        }, {
            type : "input",
            title : "Index of Focus",
            name : "index"
        }, {
            type : "input",
            title : "Labels(例如:信息,通讯录,会话,个人)",
            name : "lables"
        }, {
            type : "icon",
            title : "Icons",
            name : "icons"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "6e3fb9c5-b3dd-44aa-b0e2-3ba94973c2cd",
        name : "Tab"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
