jQuery(function($) {
    var desRootControl = Backbone.Model.extend({
        initialize : function() {

        }
    });
    var desUIEditorMobileView = Backbone.View.extend({
        initialize : function() {
            var self = this;
            this.$el.droppable({
                hoverClass : "ui_control_draggable",
                drop : function(e, ui) {
                    if (ui.draggable.length) {
                        var view = ui.draggable[0].view;
                        view.model.collection.remove(view.model);
                        self.model.items.add(view.model);
                    }
                    var offset = $(ui.draggable).offset();
                    self.$el.append(ui.draggable);
                    $(ui.draggable).offset(offset);
                },
                over : function(e, ui) {
                    e.stopPropagation();
                }
            });
            self.$current = this;
            this.model.items = window.desTemplateRootViewInstance.collection;
            this.render();
        },
        render : function() {
            this.$el.prepend($("<div></div>"));
        },
        el : ".ui_editor_mobile",
        model : new desRootControl(),
        events : {
            "mousedown" : function(e) {
                $("[data-control='BASE']", "body").hide();
                e.stopPropagation()
                window.desUIEditorMobileViewInstance.$current = this;
            }
        },
        insert : function(view) {
            if (this.$current) {
                this.$current.$el.append(view.$el);
                this.$current.model.items.add(view.model);
            }
        }
    });
    window.desUIEditorMobileViewInstance = new desUIEditorMobileView();
});

