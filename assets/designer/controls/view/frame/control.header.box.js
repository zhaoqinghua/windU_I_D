//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/frame/header.box.html");
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
            this.set("type", "HeaderBox");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "18ca801f-7797-4eac-9bf7-16a3718c85b2",
        name : "HeaderBox",
        tip : "顶部容器，用于在屏幕最顶部固定一个不随屏幕滚动的区域，常用于自定义导航功能实现。",
        type : "frame",
        icon : "HeaderBox.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
