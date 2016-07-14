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
                err || (data && self.items.import(JSON.parse(data), window.desUIEditorMobileViewInstance));
            })
        },
        buildCSS : function(f) {
            var out = this.items.buildCSS();
            f = PathModule.dirname(f) + "\\css\\" + PathModule.basename(f) + ".css"
            console.log(out);

            //window.FileMgr.rename(f,"{path}.{date}".format({path:f,date:new Date().format("yyyyMMddhhmmss")}));
            window.FileMgr.save(f, css_format(out));
        },
        buildJS : function(f) {
            var start = "(function($) {";
            var out = this.items.buildJS({"mvvm":false,"frame":true,"control":true});
            var end = "})($);";
            var dest = PathModule.dirname(f) + "\\js\\" + PathModule.basename(f) + ".js";
            //window.FileMgr.rename(f,"{path}.{date}".format({path:f,date:new Date().format("yyyyMMddhhmmss")}));
            window.FileMgr.save(dest, js_beautify(start + out + end, 4, " ", 0)); 
            {
                var start = "";
                var out = this.items.buildJS({"mvvm":true,"frame":false,"control":false});
                var end = "";
                var dest = PathModule.dirname(f) + "\\assets\\mvvm\\" + PathModule.basename(f) + ".js";
                //window.FileMgr.rename(f,"{path}.{date}".format({path:f,date:new Date().format("yyyyMMddhhmmss")}));
                window.FileMgr.save(dest, js_beautify(start + out + end, 4, " ", 0));
            }
        },
        buildHTML : function(f) {
            var work = $.getUrlParam("workspace");
            var relative = PathModule.relative(f, work);
            var out = $("<div></div>").append(this.items.buildHTML());
            var jspath = "./js/" + PathModule.basename(f) + ".js";
            var mvvmpath = "./assets/mvvm/" + PathModule.basename(f) + ".js";
            var csspath = "./css/" + PathModule.basename(f) + ".css";
            var jsdep = {};
            this.items.getDeps(jsdep);
            out = Template({
                relative : relative,
                html : out.prop("innerHTML"),
                mvvm:mvvmpath,
                css : csspath,
                js : jspath,
                jsdep : jsdep
            });
            html = PathModule.dirname(f) + "\\" + PathModule.basename(f) + ".html"
            out = style_html(out, 4, " ", 1024);
            console.log(out);
            //window.FileMgr.rename(html,"{path}.{date}".format({path:html,date:new Date().format("yyyyMMddhhmmss")}));
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
        insert : function(view, option) {
            if (option && option.get("type") == "mvvm") {
                $(".ui_model .vector").append(view.$el);
                this.model.items.add(view.model);
                return;
            }

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
        getServices : function() {
            var res = [];
            this.model.items.each(function(item) {
                var reg = item.register;
                if (reg && reg.type == "mvvm" && reg.name == "Service") {
                    res.push(item);
                }
            })
            return res;
        },
        getModels : function() {
            var res = [];
            this.model.items.each(function(item) {
                var reg = item.register;
                if (reg && reg.type == "mvvm" && reg.name == "Model") {
                    res.push(item);
                }
            })
            return res;
        },
        getCollections : function() {
            var res = [];
            this.model.items.each(function(item) {
                var reg = item.register;
                if (reg && reg.type == "mvvm" && reg.name == "Collection") {
                    res.push(item);
                }
            })
            return res;
        },
        getViewModels : function() {
            var res = [];
            this.model.items.each(function(item) {
                var reg = item.register;
                if (reg && reg.type == "mvvm" && reg.name == "ViewModel") {
                    res.push(item);
                }
            })
            return res;
        },
        getFrames : function(model, items) {
            var self = this;
            var res = items || [];
            (model || this.model).items.each(function(item) {
                var reg = item.register;
                if (reg && reg.type == "frame") {
                    res.push(item);
                    self.getFrames(item, res);
                }
            })
            return res;
        },
        getDoms : function(model, items) {
            var self = this;
            var res = items || [];
            (model || this.model).items.each(function(item) {
                var reg = item.register;
                if (reg) {
                    res.push(item);
                    self.getDoms(item, res);
                }
            })
            return res;
        },
        focus : function() {
            $("[data-control-focus]").removeAttr("data-control-focus");
            event && event.stopPropagation()
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
        build : function(type) {
            var f = $.getUrlParam("path");
            type = type || {
                html : true,
                css : true,
                js : true
            };
            type.css && this.model.buildCSS(f);
            type.js && this.model.buildJS(f);
            type.html && this.model.buildHTML(f);
        }
    });
    window.desUIEditorMobileViewInstance = new desUIEditorMobileView();
});

