jQuery(function($) {
    var desUIControl = Backbone.Model.extend({
        initialize : function() {

        },
        idAttribute : "uuid"
    });
    var desUIControlList = Backbone.Collection.extend({
        model : desUIControl
    })

    var Template = loadTemplate("../assets/designer/views/template/controls.html");

    var desUIControlView = Backbone.View.extend({
        initialize : function() {
            this.render();
        },
        template : Template,
        events : {
            "click" : "instantiation"
        },
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                this.delegateEvents(this.events);
            }
            return this;
        },
        instantiation : function(e) {
            var view = new this.model.classes.View({
                model : new this.model.classes.Config()
            });
            window.desUIEditorMobileViewInstance.insert(view);
        }
    });

    var desUIControlsListView = Backbone.View.extend({
        initialize : function() {
            this.listenTo(this.collection, "add", this.add);
        },
        collection : new desUIControlList(),
        el : '#desUIControlsViewControls',
        register : function(options, classes) {
            var model = new desUIControl(options);
            model.classes = classes;
            this.collection.add(model, {
                merge : true
            });
        },
        add : function(model) {
            var view = new desUIControlView({
                model : model
            });
            $(this.$el).append(view.$el);
        },
        getUIControl:function(type){
            return this.collection.findWhere({name:type});
        }
    });
    window.desUIControlsListViewInstance = new desUIControlsListView();
    // loadSequence([
    // "../assets/designer/controls/view/control.base.js", //base js. new controls must add below
    // "../assets/designer/controls/view/control.box.js",
    // "../assets/designer/controls/view/control.frame.js",
    // "../assets/designer/controls/view/control.button.js",
    // "../assets/designer/controls/view/control.input.js",
    // "../assets/designer/controls/view/control.list.js",
    // "../assets/designer/controls/view/control.search.js",
    // "../assets/designer/controls/view/control.slider.js",
    // "../assets/designer/controls/view/control.tab.js"
    // ], function() {
    //
    // })
});

