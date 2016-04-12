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
            this.set("type","Search");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);     
        }
    })
    
    window.desUIControlsListViewInstance.register({
                uuid : "021c646d-17c9-40ae-a351-08aa146c2714",
                name : "Search"
            },{View:View,Template:Template,Config:Config})
});