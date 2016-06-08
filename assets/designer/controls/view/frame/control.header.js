//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/frame/header.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/frame/header.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:nav_left_icon", function(data) {
                var prev = this.model.previous("nav_left_icon");
                if (prev) {
                    $("#nav-left> div", this.$el).removeClass(prev);
                }
                $("#nav-left > div", this.$el).addClass(data.changed.nav_left_icon);
            })
            this.listenTo(this.model, "change:nav_right_icon", function(data) {
                var prev = this.model.previous("nav_right_icon");
                if (prev) {
                    $("#nav-right > div", this.$el).removeClass(prev);
                }
                $("#nav-right > div", this.$el).addClass(data.changed.nav_right_icon);
            })
            this.listenTo(this.model, "change:title", function(data) {
                $(".ut", this.$el).text(data.changed.title || "标题");
            })
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
        },
        template : Template, //VIEW对应的模板
        jsTemplate:jsTemplate,
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                Backbone.Designer.View.prototype.render.apply(this, arguments);
            }
            return this;
        },
        buildHTML:function(dom){
            this.model.get("nav_left_icon") && $("#nav-left > div", dom).addClass(this.model.get("nav_left_icon"));
            this.model.get("nav_right_icon") && $("#nav-left > div", dom).addClass(this.model.get("nav_right_icon"));
            this.model.get("title") && $(".ut", dom).text(this.model.get("title"));
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
        }, {
            type : "icon",
            title : "左导航按钮图片",
            name : "nav_left_pic"
        }, {
            type : "icon",
            title : "右导航按钮图标",
            name : "nav_right_icon"
        }, {
            type : "icon",
            title : "右导航按钮图片",
            name : "nav_right_pic"
        }, {
            type : "input",
            title : "Title",
            name : "title"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "c80a41cc-c26b-454e-99bc-680a11c496d7",
        name : "Header",
        tip : "标题导航组件，用于展示标题并提供左右侧按钮，一般用于Page容器中。大部分情况一个界面仅有一个标题。",
        type : "frame",
        icon:"Header.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
