//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/squarebox.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.model.set("size_w", 70);
        },
        template : Template, //VIEW对应的模板
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                Backbone.Designer.View.prototype.render.apply(this, arguments);
            }
            return this;
        },
        appendChild : function(el,dom) {
            $("[data-control-scope='"+this.model.get("uuid")+"'].vector", dom || this.$el).append(el);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function(options) {
            this.set("type", "SquareBox");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "54a9c730-5019-4ef0-a8f2-042bbdfb942a",
        name : "SquareBox",
        tip : "正方形容器控件，根据宽度自动变更高度。其他与BOX控件相同",
        icon : "Square.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
