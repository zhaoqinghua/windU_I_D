jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/search.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:placeholder", function(data) {
                $("input", this.$el).attr("placeholder", data.changed.placeholder);
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
        buildHTML:function(dom,attr){
            this.model.get("placeholder") && $("input", dom).addClass(this.model.get("placeholder"));
            attr["data-bind"] && $("input", dom).attr("data-bind",attr["data-bind"]);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Search");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        },
        extOptions : [{
            type : "input",
            title : "PlaceHolder",
            name : "placeholder"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "021c646d-17c9-40ae-a351-08aa146c2714",
        name : "Search",
        tip : "搜索框控件",
        icon : "Search.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
