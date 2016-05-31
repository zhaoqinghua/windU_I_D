jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/slider.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/control/slider.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.render();
            this.listenTo(this.model, "change", function() {
                this.update();
            })
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.model.set("size_h",120); 
        },
        template : Template, //VIEW对应的模板
        jsTemplate : jsTemplate, //VIEW对应的JS模板
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                Backbone.Designer.View.prototype.render.apply(this, arguments);
                this.update();
            }
            return this;
        },
        update : function() {
            var extOptions = this.model.toJSON();
            var $slider = $(this.$el);
            try {
                if (this.$sv) {
                    this.$sv.ele.empty();
                    delete this.$sv;
                }
                this.$sv = appcan.slider({
                    selector : $slider,
                    aspectRatio : extOptions.aspectRatio || 6 / 16,
                    hasLabel : extOptions.hasCheckbox || true,
                    index : 0
                });
                var data = JSON.parse(this.model.get("images"));
                this.$sv.set(data);
            } catch(e) {

            }
        },
        appendChild : function(el) {
            $(this.$el).append(el);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "Slider");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("size_h", "70");
            this.set("dep", "appcan.slider.js");
            this.set("aspectRatio",(6/16).toFixed(2));
            this.set("hasLabel",true);
            this.set("images", JSONProcess(JSON.stringify([{
                img : "http://img1.3lian.com/img13/c2/32/77.jpg",
                label : "图片"
            }, {
                img : "http://img1.3lian.com/img13/c2/32/76.jpg",
                label : "图片"
            }, {
                img : "http://img1.3lian.com/img13/c2/32/81.jpg",
                label : "图片"
            }, {
                img : "http://img1.3lian.com/img13/c2/32/87.jpg",
                label : "图片"
            }, {
                img : "http://img1.3lian.com/img13/c2/32/85.jpg",
                label : "图片"
            }])))

        },
        extOptions : [{
            type : "input",
            title : "aspectRatio",
            name : "aspectRatio"
        },{
            type : "checkbox",
            title : "hasLabel",
            name : "hasLabel"
        },{
            type : "textarea",
            title : "Images",
            name : "images"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "38bf8456-83ed-42a2-b35f-72f3e395c748",
        name : "Slider",
        tip : ""
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
