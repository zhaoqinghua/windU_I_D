//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/squarebox.html");
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
        },
        appendChild:function(el){
            $(".vector",this.$el).append(el);
        }
    });
    
    var Config = Backbone.Designer.Config.extend({
        initialize:function(options){
            this.set("type","SquareBox");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        }
    })
    
    window.desUIControlsListViewInstance.register({
                uuid : "54a9c730-5019-4ef0-a8f2-042bbdfb942a",
                name : "SquareBox",
                tip:"布局容器盒子，可以承载其他控件，也可作为独立控件使用"
            },{View:View,Template:Template,Config:Config})
});
