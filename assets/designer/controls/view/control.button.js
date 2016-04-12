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
        initialize:function(){
            this.set("type","Button");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);    
        }
    })
    
    window.desUIControlsListViewInstance.register({
                uuid : "5287fad8-f593-11e5-9ce9-5e5517507c66",
                name : "Button"
            },{View:View,Template:Template,Config:Config})
});
