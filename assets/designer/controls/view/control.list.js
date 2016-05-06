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
            this.set("type","List");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);     
        }
    })
    
    window.desUIControlsListViewInstance.register({
                uuid : "99b1518f-c08f-4564-9ae5-22532a7ec299",
                name : "List",
        tip : ""
            },{View:View,Template:Template,Config:Config})
});