jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/icon.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:icon", function(data) {
                var prev = this.model.previous("icon");
                if (prev) {
                    $("i",this.$el).removeClass(prev);
                }
                $("i",this.$el).addClass(data.changed.icon);
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
        appendChild : function(el) {
            $(this.$el).append(el);
        },
        buildHTML:function(dom){
            this.model.get("icon") && $("i",dom).addClass(this.model.get("icon"));
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
        tip : ""
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
