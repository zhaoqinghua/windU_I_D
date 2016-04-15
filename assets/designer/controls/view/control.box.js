//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/box.html");
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
                var w=this.model.get("size_w");
                var h=this.model.get("size_h");
                w && this.$el.width(w);
                h && this.$el.height(h);
                Backbone.Designer.View.prototype.render.apply(this, arguments); 
            }
            return this;
        }
    });
    
    var Config = Backbone.Designer.Config.extend({
        initialize:function(options){
            this.set("type","Box");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            !options && this.set("size_h",70);
        }
    })
    
    window.desUIControlsListViewInstance.register({
                uuid : "f7c65e62-c7c3-4f6b-ae3e-fff385b590ba",
                name : "Box"
            },{View:View,Template:Template,Config:Config})
});
