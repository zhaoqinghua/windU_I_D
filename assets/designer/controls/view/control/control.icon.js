jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/icon.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:icon", function(data) {
                var prev = this.model.previous("icon");
                if (prev) {
                    $("[data-control-icon]",this.$el).removeClass(prev);
                }
                $("[data-control-icon]",this.$el).addClass(data.changed.icon);
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
        },
        appendChild : function(el,dom) {
            $(dom || this.$el).append(el);
        },
        buildHTML:function(dom,attr){
            this.model.get("icon") && $(".fa",dom).addClass(this.model.get("icon"));
            attr["data-bind"] && $(".fa",dom).attr("data-bind",attr["data-bind"]);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Icon");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        },
        extOptions : [{
            type : "icon",
            title : "Icon",
            name : "icon"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "06c2a3fa-4448-4a27-8b66-ae4d0469e52c",
        name : "Icon",
        tip : "图标组件，用于展示图标",
        icon : "Icon.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
