jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/search.html");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.model.set("size_h",70); 
        },
        template : Template, //VIEW对应的模板
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                Backbone.Designer.View.prototype.render.apply(this, arguments);
            }
            return this;
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Search");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "021c646d-17c9-40ae-a351-08aa146c2714",
        name : "Search",
        tip : "",
        icon : "UI设计器_53.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
}); 