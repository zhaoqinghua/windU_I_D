jQuery(function($) {
    var Template = loadTemplate("../assets/designer/views/template/output/out.html");
    
    var desRootControl = Backbone.Model.extend({
        initialize : function() {

        },
        save : function(f) {
            var out = this.items.export();
            console.log(out);
            window.FileMgr.save(f, JSON.stringify(out));
        },
        load : function(f) {
            var self = this;
            window.FileMgr.load(f, function(err, data) {
                err || (data && self.items.import(JSON.parse(data), this));
            })
        },
        buildCSS : function(f) {
            var out = this.items.buildCSS();
            f = PathModule.dirname(f) + "\\css\\" + PathModule.basename(f) + ".css"
            console.log(out);
            
            window.FileMgr.rename(f,"{path}.{date}".format({path:f,date:new Date().format("yyyyMMddhhmmss")}));
            window.FileMgr.save(f, css_format(out));
        },
        buildJS : function(f) {
            var start = "(function($) {";
            var out = this.items.buildJS();
            var end = "})($);";
            f = PathModule.dirname(f) + "\\js\\" + PathModule.basename(f) + ".js";
            window.FileMgr.rename(f,"{path}.{date}".format({path:f,date:new Date().format("yyyyMMddhhmmss")}));
            window.FileMgr.save(f, js_beautify(start + out + end, 4, " ", 0));
        },
        buildHTML : function(f) {
            var work = $.getUrlParam("workspace");
            var relative = PathModule.relative(f,work);
            var out = $("<div></div>").append(this.items.buildHTML());
            var jspath = "./js/" + PathModule.basename(f) + ".js";
            var csspath = "./css/" + PathModule.basename(f) + ".css";
            var jsdep = {};
            this.items.getDeps(jsdep);
            out = Template({
                relative : relative,
                html : out.prop("innerHTML"),
                css : csspath,
                js : jspath,
                jsdep:jsdep
            });
            html = PathModule.dirname(f) + "\\" + PathModule.basename(f) + ".html"
            out = style_html(out, 4, " ", 1024);
            console.log(out);
            window.FileMgr.rename(html,"{path}.{date}".format({path:html,date:new Date().format("yyyyMMddhhmmss")}));
            window.FileMgr.save(html, out);
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
                        if (this == $(ui.draggable).parent()[0]) {
                            var pos = ui.position;
                            if (view.model.get("on/off_offset")) {
                                view.model.set("offset_x", pos.left);
                                view.model.set("offset_y", pos.top);
                            }
                            return;
                        }
                        view.model.collection.remove(view.model);
                        self.model.items.add(view.model);
                        var offset = ui.offset;
                        self.$el.append(ui.draggable);
                        $(ui.draggable).offset(offset);
                    }
                },
                over : function(e, ui) {
                    e.stopPropagation();
                }
            });
            self.$current = this;
            this.model.items = window.desTemplateRootViewInstance.collection;
            this.model.view = this;
            this.render();
            this.listenTo(this.model, "change:viewState", function(data) {
                self.model.items.design(data.changed.viewState);
            })
        },
        render : function() {
        },
        el : ".ui_editor_mobile",
        model : new desRootControl(),
        events : {
            "mousedown" : function(e) {
                this.focus();
                e.stopPropagation();
            },
            "mousewheel" : "wheel"
        },
        wheel : function(e) {
            this.onwheel = true;
            return true;
        },
        insert : function(view) {
            if (view.verifyParent && !view.verifyParent(this.$current)) {
                return;
            }
            if (this.$current) {
                if (this.$current.appendChild)
                    this.$current.appendChild(view.$el);
                else
                    this.$current.$el.append(view.$el);
                this.$current.model.items.add(view.model);
            }
        },
        focus : function() {
            $("[data-control-focus]").removeAttr("data-control-focus");
            event.stopPropagation()
            window.desUIEditorMobileViewInstance.$current = this;
        },
        removeItem : function(item) {
            var item = item || this.$current;
            if (item != this) {
                item.model.templateItemView.remove();
                item.model.collection.remove(item.model);
                item.remove();
            }
        },
        design : function(state) {
            state && $(".ui_editor_mobile").addClass("taggle_border");
            !state && $(".ui_editor_mobile").removeClass("taggle_border");
            this.model.set("viewState", state);
        },
        save : function() {
            var f = $.getUrlParam("path");
            this.model.save(f);
        },
        load : function() {
            var f = $.getUrlParam("path");
            this.model.load(f);
        },
        build : function() {
            var f = $.getUrlParam("path");
            this.model.buildCSS(f);
            this.model.buildJS(f);
            this.model.buildHTML(f);
        }
    });
    window.desUIEditorMobileViewInstance = new desUIEditorMobileView();
});

