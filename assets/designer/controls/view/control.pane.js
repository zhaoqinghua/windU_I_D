//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/pane.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:active", function(data) {
                !data.changed.active && this.$el.removeClass("active");
                data.changed.active && this.$el.addClass("active");
            })
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
        initialize:function(options){
            this.set("type","Pane");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("active",false);
        },extOptions : [{
            type : "checkbox",
            title : "Active",
            name : "active"
        }]
    })
    
    window.desUIControlsListViewInstance.register({
                uuid : "433ef517-22a8-40ce-bfa1-fbe69682e55d",
                name : "Pane",
                tip:"容器，用于部署于FixSizeBox实现界面内滚动。也可用于界面内多界面切换"
            },{View:View,Template:Template,Config:Config})
});
