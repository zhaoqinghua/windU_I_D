jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/input.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:placeholder", function(data) {
                $("input", this.$el).attr("placeholder", data.changed.placeholder);
            })
            this.listenTo(this.model, "change:inputtype", function(data) {
                $("input", this.$el).attr("type", data.changed.inputtype);
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
        buildHTML : function(dom,attr) {
            this.model.get("placeholder") && $("input", dom).addClass(this.model.get("placeholder"));
            attr["data-bind"] && $("input", dom).attr("data-bind",attr["data-bind"]);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Input");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("inputtype", "text");
        },
        extOptions : [{
            type : "input",
            title : "PlaceHolder",
            name : "placeholder"
        },{
            type : "select",
            title : "输入框类型",
            name : "inputtype",
            options : [{
                val : "text",
                lab : "text"
            }, {
                val : "password",
                lab : "password"
            }, {
                val : "number",
                lab : "number"
            }, {
                val : "email",
                lab : "email"
            }, {
                val : "url",
                lab : "url"
            }]
        }]

    })

    window.desUIControlsListViewInstance.register({
        uuid : "2207d5e5-f168-42ad-b2a7-9b04fc329e10",
        name : "Input",
        tip : "标准输入框控件",
        icon : "Input.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
