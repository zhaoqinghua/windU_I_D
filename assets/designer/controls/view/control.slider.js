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
            this.set("type","Slider");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);    
        }
    })
    
    window.desUIControlsListViewInstance.register({
                uuid : "60399a48-419b-4d0c-bbbe-9b404ed6339f",
                name : "Slider",
        tip : ""
            },{View:View,Template:Template,Config:Config})
});