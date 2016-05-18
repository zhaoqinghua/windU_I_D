//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/header.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:nav_left_icon", function(data) {
                var prev = this.model.previous("nav_left_icon");
                if(prev){
                    $("#nav-left> div",this.$el).removeClass(prev);
                }
                $("#nav-left > div",this.$el).addClass(data.changed.nav_left_icon);
            })
            this.listenTo(this.model, "change:nav_right_icon", function(data) {
                var prev = this.model.previous("nav_right_icon");
                if(prev){
                    $("#nav-right > div",this.$el).removeClass(prev);
                }
                $("#nav-right > div",this.$el).addClass(data.changed.nav_right_icon);
            })
            this.listenTo(this.model,"change:title",function(data){
                $(".ut",this.$el).text(data.changed.title || "标题");
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
        initialize : function() {
            this.set("type", "Header");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("on/off_draggable", false);
        },
        extOptions : [{
            type : "icon",
            title : "左导航按钮图标",
            name : "nav_left_icon"
        },
        {
            type : "icon",
            title : "左导航按钮图片",
            name : "nav_left_pic"
        },
        {
            type : "icon",
            title : "右导航按钮图标",
            name : "nav_right_icon"
        },
        {
            type : "icon",
            title : "右导航按钮图片",
            name : "nav_right_pic"
        },{
            type : "input",
            title : "Title",
            name : "title"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "c80a41cc-c26b-454e-99bc-680a11c496d7",
        name : "Header",
        tip : "",
        type: "frame"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
