//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/box.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.model.set("size_h", 70);
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
        initialize : function(options) {
            this.set("type", "Box");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "f7c65e62-c7c3-4f6b-ae3e-fff385b590ba",
        name : "Box",
        tip : "布局容器盒子，可以承载其他控件，也可作为独立控件使用。作为最常用组件，主要用于在界面基础布局情况下实现二级元素的布局",
        icon : "Box.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
