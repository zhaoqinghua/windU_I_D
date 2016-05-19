jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/text.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model,"change:text",function(data){
                data.changed.text && this.$el.text(data.changed.text);
            })
            this.listenTo(this.model,"change:line",function(data){
                data.changed.line && this.$el.css("-webkit-line-clamp",data.changed.line);
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
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Text");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("text","text")
        },
        extOptions : [{
            type : "input",
            title : "Text",
            name : "text"
        },
        {
            type : "input",
            title : "Line Count",
            name : "line"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "41d45be8-fca3-44e7-8f96-31e011312d0c",
        name : "Text",
        tip : ""
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
}); 