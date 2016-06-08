//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/frame/mask.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/frame/mask.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:active", function(data) {
                var self = this;
                if (!data.changed.active) {
                    self.$el.removeClass("show");
                    setTimeout(function() {
                        self.$el.removeClass("active");
                    }, 550)
                }
                if (data.changed.active) {
                    self.$el.addClass("active");
                    setTimeout(function() {
                        self.$el.addClass("show");
                    }, 1)
                }
                this.model.cla["active"] = data.changed.active ? "active show" : undefined;
            })
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
        },
        template : Template, //VIEW对应的模板
        jsTemplate : jsTemplate,
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                this.$el.on("touchstart", function(e) {
                    e.preventDefault();
                })
                this.$el.on("touchmove", function(e) {
                    e.preventDefault();
                })
                this.$el.on("touchend", function(e) {
                    e.preventDefault();
                })
                this.$el.on("tap", function(e) {
                    e.preventDefault();
                    this.$el.toggleClass("active")
                })
                Backbone.Designer.View.prototype.render.apply(this, arguments);
            }
            return this;
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function(options) {
            this.set("type", "Mask");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("on/off_draggable", false);
        },
        extOptions : [{
            type : "checkbox",
            title : "Active",
            name : "active"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "7dddd66f-c240-42ca-965e-18840d709dbb",
        name : "Mask",
        tip : "遮盖层，不能插入任何子元素。用于遮盖窗口元素。通常情况直接插入到的BODY下",
        type : "frame",
        icon : "FlexVer.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
