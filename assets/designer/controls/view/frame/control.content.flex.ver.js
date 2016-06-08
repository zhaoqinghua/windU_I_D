//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/frame/contentflexver.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
        },
        template : Template, //VIEW对应的模板
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                var h = this.model.get("size_h");
                h && this.$el.height(h);
                Backbone.Designer.View.prototype.render.apply(this, arguments);
            }
            return this;
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function(options) {
            this.set("type", "ContentFlexVer");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            !options && this.set("size_h", 100);
            this.set("layout", "box");
            this.set("layout_align", "ub-ac");
            this.set("layout_orient", "ub-ver");
            this.set("size_w", "100%");
            this.set("size_h", "100%");
            this.set("position", "absolute");
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "2b7d0eac-5af9-4ad2-b231-4b78152a9ed9",
        name : "ContentFlexVer",
        tip : "弹性纵向排布容器，内部元素按照比率或大小纵向按顺序排列。主要用于不超过屏幕大小的网格化控件排版。",
        type : "frame",
        icon:"FlexVer.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
