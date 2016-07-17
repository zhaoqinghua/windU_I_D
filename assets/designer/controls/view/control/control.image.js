jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/image.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            var self = this;
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.listenTo(this.model,"change:src",function(data){
                this.$el.attr("src",data.changed.src);
            })
            this.listenTo(this.model,"change:width",function(data){
                this.$el.attr("width",data.changed.width);
            })
            this.listenTo(this.model,"change:height",function(data){
                this.$el.attr("height",data.changed.height);
            })
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
            this.set("type", "Image");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("width","auto");
            this.set("height","auto");
            this.set("src","");
        },
        extOptions:[{
            type : "input",
            title : "图片路径",
            name : "src"
        },{
            type : "input",
            title : "图片宽度",
            name : "width"
        },{
            type : "input",
            title : "图片高度",
            name : "height"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "4b78c7ac-5d40-4d1b-b5e6-740314738146",
        name : "Image",
        tip : "图片组件，用于通过img标签显示图片",
        icon : "Img.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
}); 