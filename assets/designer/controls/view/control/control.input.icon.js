jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/iconinput.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:icons", function(data) {
                var prev = this.model.previous("icons");
                if(prev){
                    $("[data-control-icon]",this.$el).removeClass(prev);
                }
                $("[data-control-icon]",this.$el).addClass(data.changed.icons);
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

    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "iconInput");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("icons", "fa-qrcode");
        },
        extOptions : [{
            type : "icon",
            title : "Icons",
            name : "icons"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "82d4b778-872a-4819-bf73-4e7c27be5474",
        name : "带图标Input",
        tip : ""
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
}); 