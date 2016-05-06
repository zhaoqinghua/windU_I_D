//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/boxscroll.html");
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
                Backbone.Designer.View.prototype.render.apply(this, arguments);
                this.$el.on("scroll", function(e) {
                    console.log(self.$el.scrollTop());
                })
            }
            return this;
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function(options) {
            this.set("type", "ScrollBox");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "4f929ff8-ab75-475d-81ec-4f01b4c21805",
        name : "ScrollBox",
        tip : "支持纵向滚动的容器，可以承载其他控件，并且内部元素变化不会对容器外产生影响。"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
