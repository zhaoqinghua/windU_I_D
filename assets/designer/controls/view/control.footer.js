//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/footer.html");
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
            }
            return this;
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Footer");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("on/off_draggable", false);
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "fda89f0b-4609-440b-8339-d10fbb8dd6f7",
        name : "Footer",
        tip : "",
        type: "frame"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
