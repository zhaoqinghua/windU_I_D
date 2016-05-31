jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/switchbtn.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/control/switchbtn.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:placeholder", function(data) {
                $("input", this.$el).attr("placeholder", data.changed.placeholder);
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
                Backbone.Designer.View.prototype.render.apply(this, arguments);
                appcan.switchBtn(this.$el, function(obj, value) {

                })
            }
            return this;
        },
        buildHTML : function(dom) {
            $(dom).addClass("utra");
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "SwitchBtn");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        },
        extOptions : [{
            type : "checkbox",
            title : "Mini Switch Btn",
            name : "isMini"
        }]

    })

    window.desUIControlsListViewInstance.register({
        uuid : "2dd8269c-7b32-4f11-99a5-3405cec06ffc",
        name : "SwitchBtn",
        tip : ""
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
