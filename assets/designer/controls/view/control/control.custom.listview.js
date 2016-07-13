jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/customlistview.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.model.set("size_h", 70);
            this.listenTo(this.model,"change:isBig",function(data){
                !data.changed.isBig && $("li:nth-child(1)", this.$el).removeClass("col2");
                data.changed.isBig && $("li:nth-child(1)", this.$el).addClass("col2");
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
        },
        appendChild : function(el, dom) {
            $("li:nth-child(1)", dom || this.$el).append(el);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "CustomListView");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("size_h", "70");
        },
        extOptions : [{
            type : "checkbox",
            title : "双列列表",
            name : "isBig"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "99b1518f-c08f-4564-9ae5-22532a7ec299",
        name : "CustomListView",
        tip : "用户自定义列表控件，用于容纳自定义列表条目控件。",
        icon : "CustomLv.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
