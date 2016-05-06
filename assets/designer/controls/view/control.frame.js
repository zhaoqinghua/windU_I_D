//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/base.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
        },
        template : Template, //VIEW对应的模板
        render : function() {

            return this;
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Frame");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "467518c0-5c16-4837-93d5-a6f205c258f2",
        name : "Frame",
        tip : ""
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
