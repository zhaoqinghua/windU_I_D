jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/customlistitem.html");
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
        },
        appendChild : function(el) {
            $(this.$el).append(el);
        },
        verifyParent:function(view){
            var res = view.$el.attr("data-control") == "CUSTOMLISTVIEW";
            !res && bootbox.alert({message: 'ListItem只能嵌入在ListView控件中！'})
            return res; 
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "CustomListItem");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        }
    })

    window.desUIControlsListViewInstance.register({
        uuid : "7b28b501-ed90-49ca-8799-c2dd38736cc6",
        name : "CustomListItem",
        tip : "用户自定义列表条目控件，开发者可自行设计内部元素排布",
        icon : "CustomLi.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
}); 