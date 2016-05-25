jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/input.html");
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
        buildHTML : function(dom) {
            this.model.get("placeholder") && $("input", dom).addClass(this.model.get("placeholder"));
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Input");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        },
        extOptions : [{
            type : "input",
            title : "PlaceHolder",
            name : "placeholder"
        }]

    })

    window.desUIControlsListViewInstance.register({
        uuid : "2207d5e5-f168-42ad-b2a7-9b04fc329e10",
        name : "Input",
        tip : ""
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
