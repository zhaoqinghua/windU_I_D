//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/frame/outsidebar.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/frame/outsidebar.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:active", function(data) {
                !data.changed.active && this.$el.removeClass("active");
                data.changed.active && this.$el.addClass("active");
                this.model.cla["active"] = data.changed.active;
            })
            this.listenTo(this.model, "change:position", function(data) {
                var prev = this.model.previous("position");
                if (prev) {
                    this.$el.removeClass(prev);
                    this.model.cla[prev] = false;
                }
                this.$el.addClass(data.changed.position);
                this.model.cla[data.changed.position] = true;
            })
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
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
            this.set("type", "OutsideBar");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("on/off_draggable", false);
            this.set("position", "float_left");
        },
        extOptions : [{
            type : "select",
            title : "位置",
            name : "position",
            options : [{
                val : "float_left",
                lab : "左侧"
            }, {
                val : "float_right",
                lab : "右侧"
            }, {
                val : "float_bottom",
                lab : "下侧"
            }]
        }, {
            type : "checkbox",
            title : "Active",
            name : "active"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "c1981d5b-e996-4262-a114-ade26abcebbd",
        name : "OutsideBar",
        tip : "侧边栏容器，用于实现从两侧向窗口内滑动。通常情况直接插入到的BODY下",
        type : "frame",
        icon : "Side.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
