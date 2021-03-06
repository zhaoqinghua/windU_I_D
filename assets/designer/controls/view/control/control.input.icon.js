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
            this.model.get("icons") && $("[data-control-icon]",dom).addClass(this.model.get("icons"));
            this.model.get("placeholder") && $("input", dom).addClass(this.model.get("placeholder"));
            attr["data-bind"] && $("input", dom).attr("data-bind",attr["data-bind"]);
        }

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
        },{
            type : "input",
            title : "PlaceHolder",
            name : "placeholder"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "82d4b778-872a-4819-bf73-4e7c27be5474",
        name : "iconInput",
        tip : "带图标的输入框控件，可自定义配置图标",
        icon : "IconInput.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
}); 