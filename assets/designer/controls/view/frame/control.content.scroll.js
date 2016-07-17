//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/frame/contentscroll.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/frame/contentscroll.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
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
                $.scrollbox(this.$el).on("releaseToReload", function() {//After Release,we reset the bounce
                    var self = this;
                    console.log("releaseToReload");
                    this.$el.trigger("reload", this);
                }).on("onReloading", function(a) {//if onreloading status, drag will trigger this event
                    console.log("onReloading", a);
                }).on("dragToReload", function() {//drag over 30% of bounce height,will trigger this event
                    console.log("dragToReload");
                }).on("draging", function(percent) {//on draging, this event will be triggered.
                    console.log("draging", percent);
                }).on("scrollbottom", function() {//on scroll bottom,this event will be triggered.you should get data from server
                    console.log("scrollbottom");
                    this.$el.trigger("more", this);
                });
            }
            return this;
        },
        appendChild : function(el, dom) {
            $(".scrollbox", dom || this.$el).append(el);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function(options) {
            this.set("type", "ScrollContent");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "4f929ff8-ab75-475d-81ec-4f01b4c21805",
        name : "ScrollContent",
        tip : "支持纵向滚动的容器，需要部署于Page组件中。",
        type : "frame",
        icon:"Scroll.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
