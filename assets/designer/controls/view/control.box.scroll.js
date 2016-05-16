//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/boxscroll.html");
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
                $.scrollbox(this.$el).on("releaseToReload", function() {//After Release,we reset the bounce
                    var self = this;
                    console.log("releaseToReload");
                    setTimeout(function() {
                        self.reset();
                    }, 2000);
                }).on("onReloading", function(a) {//if onreloading status, drag will trigger this event
                    console.log("onReloading", a);
                }).on("dragToReload", function() {//drag over 30% of bounce height,will trigger this event
                    console.log("dragToReload");
                }).on("draging", function(percent) {//on draging, this event will be triggered.
                    console.log("draging",percent);
                }).on("scrollbottom", function() {//on scroll bottom,this event will be triggered.you should get data from server
                    console.log("scrollbottom");
                }).reload();
            }
            return this;
        },
        appendChild : function(el) {
            $('[data-control="BounceBox"]', this.$el).append(el);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function(options) {
            this.set("type", "ScrollBox");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "4f929ff8-ab75-475d-81ec-4f01b4c21805",
        name : "ScrollBox",
        tip : "支持纵向滚动的容器，可以承载其他控件，并且内部元素变化不会对容器外产生影响。"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
