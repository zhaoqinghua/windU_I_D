jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/select.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/control/select.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.listenTo(this.model, "change:items", function(data) {
                this.update();
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
                this.update();
                appcan.select($(this.$el), function(ele, value) {
                });
            }
            return this;
        },
        update : function(dom) {
            $("select", dom || this.$el).empty();
            var items = JSON.parse(this.model.get("items") || "[]");
            for (var i in items) {
                $("select", dom || this.$el).append($('<option value="' + items[i].val + '">' + items[i].lab + '</option>'));
            }
        },
        buildHTML : function(dom) {
            this.update(dom);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Select");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("label", "");
            this.set("items", JSONProcess(JSON.stringify([{
                val : 0,
                lab : "选项1"
            }, {
                val : 1,
                lab : "选项2"
            }])));
        },
        extOptions : [{
            type : "input",
            title : "Label",
            name : "label"
        }, {
            type : "textarea",
            title : "Select Items",
            name : "items"
        }]

    })

    window.desUIControlsListViewInstance.register({
        uuid : "2b2a979b-efbe-48dd-af37-f4bc750ca2d3",
        name : "Select",
        tip : ""
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
