jQuery(function($) {
    var desRootControl = Backbone.Model.extend({
        initialize: function() {

        },
        save: function() {
            var out = this.items.export();
            console.log(out);
            window.FileMgr.save(JSON.stringify(out));
        },
        load: function() {
            var self = this;
            window.FileMgr.load(function(err, data) {
                err || self.items.import(JSON.parse(data),this);
            })
        },
        buildCSS:function(){
            var out = this.items.buildCSS();
            console.log(out);
            window.FileMgr.save(out,function(){},"D:/Server/html/Out/layout.css");
        }
    });
    var desUIEditorMobileView = Backbone.View.extend({
        initialize: function() {
            var self = this;
            this.$el.droppable({
                hoverClass: "ui_control_draggable",
                drop: function(e, ui) {
                    if (ui.draggable.length) {
                        var view = ui.draggable[0].view;
                        view.model.collection.remove(view.model);
                        self.model.items.add(view.model);
                    }
                    var offset = $(ui.draggable).offset();
                    self.$el.append(ui.draggable);
                    $(ui.draggable).offset(offset);
                },
                over: function(e, ui) {
                    e.stopPropagation();
                }
            });
            self.$current = this;
            this.model.items = window.desTemplateRootViewInstance.collection;
            this.model.view = this;
            this.render();
        },
        render: function() {
            this.$el.prepend($("<div></div>"));
        },
        el: ".ui_editor_mobile",
        model: new desRootControl(),
        events: {
            "mousedown": function(e) {
                this.focus();
                e.stopPropagation();
            }
        },
        insert: function(view) {
            if (this.$current) {
                this.$current.$el.append(view.$el);
                this.$current.model.items.add(view.model);
            }
        },
        focus: function() {
            $("[data-control='BASE']", "body").hide();
            e.stopPropagation()
            window.desUIEditorMobileViewInstance.$current = this;
        },
        save: function() {
            this.model.save();
        },
        load: function() {
            this.model.load();
        },
        buildCSS:function(){
            this.model.buildCSS();
        }
    });
    window.desUIEditorMobileViewInstance = new desUIEditorMobileView();
});

