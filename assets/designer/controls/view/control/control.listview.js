jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/listview.html");
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
            $(this.$el).append(el);
        }
    });
    
    var Config = Backbone.Designer.Config.extend({
        initialize:function(){
            this.set("type","ListView");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments); 
            this.set("size_h","70");    
        }
    })
    
    window.desUIControlsListViewInstance.register({
                uuid : "99b1518f-c08f-4564-9ae5-22532a7ec299",
                name : "ListView",
        tip : ""
            },{View:View,Template:Template,Config:Config})
});