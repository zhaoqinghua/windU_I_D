//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/base.html");
    var View = Backbone.View.extend({//options...
        initialize: function(option) {
            var self = this;
            this.model.view = this;
            this.$el.on("click", function(e) {
                e.stopPropagation();
                self.focus();
            })
            this.$el.on("mousedown", function(e) {
                e.stopPropagation();
                // self.focus();
            })
            this.model.get("on/off_dropable") && this.$el.droppable({
                hoverClass: "ui_control_draggable",
                tolerance: "intersect",
                greedy: true,
                drop: function(e, ui) {
                    if (self.$el[0] == $(ui.draggable).parent()[0])
                        return;
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
            this.$el.draggable({
                stop: function(event, ui) {
                    var pos = self.$el.position();
                    if (self.model.get("on/off_offset")) {
                        self.model.set("offset_x", pos.left);
                        self.model.set("offset_y", pos.top);
                    }
                },
                drag: function(event, ui) {
                    if (self.model.get("on/off_offset")) {
                        self.model.set("offset_x", ui.position.left);
                        self.model.set("offset_y", ui.position.top);
                    }
                    e.stopPropagation();
                }
            });
            this.$el.draggable(this.model.get("on/off_offset") ? "enable" : "disable");
            //this.resize(this.$el,0,0,1,1,"move");
            this.resize($("[data-pos='lt']", this.$focus), 1, 1, 1, 1, "nw-resize");
            this.resize($("[data-pos='lc']", this.$focus), 1, 0, 1, 0, "w-resize");
            this.resize($("[data-pos='lb']", this.$focus), 1, -1, 1, 0, "sw-resize");
            this.resize($("[data-pos='ct']", this.$focus), 0, 1, 0, 1, "n-resize");
            this.resize($("[data-pos='cb']", this.$focus), 0, -1, 0, 0, "s-resize");
            this.resize($("[data-pos='rt']", this.$focus), -1, 1, 0, 1, "ne-resize");
            this.resize($("[data-pos='rc']", this.$focus), -1, 0, 0, 0, "e-resize");
            this.resize($("[data-pos='rb']", this.$focus), -1, -1, 0, 0, "se-resize");

            this.listenTo(this.model, "change:uuid", function(data) {
                $('span[data-flag="uuid"]', this.$focus).text("[" + data.changed.uuid + "]")
            });
            this.listenTo(this.model, "change:size_w", function(data) {
                data.changed.size_w === undefined || this.$el.width(data.changed.size_w);
                data.changed.size_w === undefined && this.$el.css("width", "");
            })
            this.listenTo(this.model, "change:size_h", function(data) {
                data.changed.size_h === undefined || this.$el.height(data.changed.size_h);
                data.changed.size_h === undefined && this.$el.css("height", "");
            })
            this.listenTo(this.model, "change:offset_x", function(data) {
                if (data.changed.offset_x === undefined) {
                    this.$el.css("left", "");
                    return;
                }
                var pos = this.$el.position();
                var dx = parseInt(data.changed.offset_x) - pos.left;
                var offset = this.$el.offset();
                offset.left += dx;
                self.$el.offset(offset);
            })
            this.listenTo(this.model, "change:offset_y", function(data) {
                if (data.changed.offset_y === undefined) {
                    this.$el.css("top", "");
                    return;
                }
                var pos = this.$el.position();
                var dy = parseInt(data.changed.offset_y) - pos.top;
                var offset = this.$el.offset();
                offset.top += dy;
                self.$el.offset(offset);
            })

            this.listenTo(this.model, "change:position", function(data) {
                switch (data.changed.position) {
                    case "absolute":
                        self.$el.css("position", "");
                        self.$el.addClass("uab");
                        break;
                    default:
                        self.$el.css("position", "");
                        self.$el.removeClass("uab");
                        break;
                }
            });
            this.listenTo(this.model, "change:layout", function(data) {
                switch (data.changed.layout) {
                    case "box":
                        self.$el.css("display", "");
                        self.$el.addClass("ub");
                        break;
                    default:
                        self.$el.css("display", "");
                        self.$el.removeClass("ub");
                        break;
                }
            });
            this.listenTo(this.model, "change:flex", function(data) {
                self.$el.removeClass("ub-f1 ub-f2 ub-f3 ub-f4 ub-f5 ub-f6 ub-f7");
                self.$el.addClass(data.changed.flex);
            });
            this.listenTo(this.model, "change:on/off_offset", function(data) {
                self.$el.draggable(data.changed["on/off_offset"] ? "enable" : "disable");
            });
            this.listenTo(this.model, "change:layout_pack", function(data) {
                self.$el.removeClass("ub-pc ub-pe ub-pj");
                self.$el.addClass(data.changed.layout_pack);
            });
            this.listenTo(this.model, "change:layout_align", function(data) {
                self.$el.removeClass("ub-ac ub-ae");
                self.$el.addClass(data.changed.layout_align);
            });
            this.listenTo(this.model, "change:layout_orient", function(data) {
                self.$el.removeClass("ub-ver");
                self.$el.addClass(!data.changed.layout_orient ? "" : "ub-ver");
            })
            this.listenTo(this.model, "change:layout_dir", function(data) {
                self.$el.removeClass("ub-rev");
                self.$el.addClass(!data.changed.layout_dir ? "" : "ub-rev");
            })
            this.listenTo(this.model, "change:css", function(data) {
                self.$el.removeClass(this.model.previous("css"));
                self.$el.addClass(data.changed.css);
            })

            this.listenTo(this.model, "change:style_background_color", function(data) {
                self.$el.css("background-color", data.changed.style_background_color);
            })
            this.listenTo(this.model, "change:style_padding", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var padding = data.changed.style_padding;
                var style = padding.top + "px " + padding.right + "px " + padding.bottom + "px " + padding.left + "px";
                self.$el.css("padding", style);
            })
            this.listenTo(this.model, "change:style_margin", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var margin = data.changed.style_margin;
                var style = margin.top + "px " + margin.right + "px " + margin.bottom + "px " + margin.left + "px";
                self.$el.css("margin", style);
            }),
                this.listenTo(this.model, "change:style_border", function(data) {
                    //self.$el.css("background-color",data.changed.style_background_color);
                    var border = data.changed.style_border;
                    var style = border.width + "px " + border.type + " " + border.color;
                    self.$el.css("border", style);
                }),
                this.listenTo(this.model, "change:style_border_radius", function(data) {
                    var border = data.changed.style_border_radius;
                    var style = parseInt(border) + "px";
                    self.$el.css("border-radius", style);
                })
        },
        template: Template, //VIEW对应的模板
        render: function() {
            this.$focus = $(Template(this.model.toJSON()));
            $("[data-control='BASE']", this.$focus).hide();
            this.$el.prepend(this.$focus);
            this.$el[0].view = this;
            return this;
        },
        focus: function() {
            var self = this;
            $("[data-control='BASE']", "body").hide();
            $("[data-control='BASE']", self.$focus).show();
            window.desUIEditorMobileViewInstance.$current = self;
            window.desUIControlsPropertiesViewInstance.bind(self);
            window.desUIControlsCustomPropertiesViewInstance.bind(self);
            window.desUIControlsStyleViewInstance.bind(self);
            window.desTemplateRootViewInstance.focusItem(self);
        },
        resize: function(ele, zx, zy, lx, ly, cursor) {
            var self = this;
            var _move = false;
            var _x,
                _y;
            var w = this.$el.width();
            var h = this.$el.height();
            $(ele).hover(function() {
                cursor == "move" || self.$el.css('cursor', cursor);
            }, function() {
                cursor == "move" || self.$el.css('cursor', 'default');
            }).click(function() {
            }).mousedown(function(e) {
                _move = true;
                _x = e.pageX;
                _y = e.pageY;
                cursor != "move" || self.$el.css('cursor', 'move');
                e.stopPropagation();
            });
            $(document).mousemove(function(e) {
                if (_move) {
                    var dx = e.pageX - _x;
                    var dy = e.pageY - _y;
                    if (self.model.get("on/off_size")) {
                        var w = self.$el.width() - zx * dx;
                        var h = self.$el.height() - zy * dy;
                        self.$el.width(w);
                        self.$el.height(h);
                        self.model.set("size_w", w)
                        self.model.set("size_h", h)
                    }
                    if (self.model.get("on/off_offset")) {
                        var offset = self.$el.offset();
                        ly && (offset.top += (ly ? ly * dy : 0));
                        lx && (offset.left += (lx ? lx * dx : 0));
                        self.$el.offset(offset);
                        var pos = self.$el.position();
                        lx && self.model.set("offset_x", pos.left);
                        ly && self.model.set("offset_y", pos.top);
                    }
                    _x = e.pageX;
                    _y = e.pageY;
                }
            }).mouseup(function() {
                cursor != "move" || self.$el.css('cursor', 'default');
                _move = false;
            });
        }
    });

    var Config = Backbone.Model.extend({
        initialize: function() {
            var uuid = this.get("uuid");
            uuid || this.set("uuid", this.get("type") + "_" + getUUID());
            this.set("flex", "");
            //flex0-7
            this.set("position", "");
            //relative, absolute
            this.set("layout", "");
            this.set("layout_orient", "");
            this.set("layout_pack", "");
            this.set("layout_align", "");
            this.set("layout_dir", "");
            //box, block
            this.set("size_w", undefined);
            this.set("size_h", undefined);
            this.set("offset_x", undefined);
            this.set("offset_y", undefined);

            this.set("css", "");

            this.set("style_padding", { top: 0, left: 0, right: 0, bottom: 0 });
            this.set("style_margin", { top: 0, left: 0, right: 0, bottom: 0 });
            this.set("style_border", { width: 0, color: "rgb(0,0,0)", type: "solid" });
            this.set("style_border_radius", 0);
            this.set("style_background_color", "");
            //
            this.set("project", "");
            this.set("private", "");
            this.set("custom", {});

            this.set("on/off_flex", true);
            this.set("on/off_layout", true);
            this.set("on/off_offset", true);
            this.set("on/off_size", true);
            this.set("on/off_dropable", true);
            this.set("on/off_effect", true);
            this.set("on/off_project", true);
            this.set("on/off_private", true);
            this.set("on/off_custom", true);
            Backbone.Model.prototype.initialize.apply(this, arguments);
            this.items = new Items();
        },
        idAttribute: "uuid",
        extOptions: [],
        export: function() {
            var control = this.toJSON();
            control.items = this.items.export();
            return control;
        },
        buildCSS:function(){
            var css = [];
            css.push("#"+this.get("uuid")+"{");
            var padding = this.get("style_padding");
            (padding.left||padding.top||padding.right||padding.bottom) && (css.push("\tpadding:"+padding.top + "px " + padding.right + "px " + padding.bottom + "px " + padding.left + "px;"));
            var margin = this.get("style_margin");
            (margin.left||margin.top||margin.right||margin.bottom) && (css.push("\tmargin:"+margin.top + "px " + margin.right + "px " + margin.bottom + "px " + margin.left + "px;"));            
            css.push("}");
            if(css.length == 2)
                css = [];
            css.push(this.items.buildCSS());
            return css.join("\r\n");
            
        }
    })

    var Items = Backbone.Collection.extend({
        model: Config,
        initialize: function() {

        },
        export: function() {
            var items = [];
            for (var i = 0; i < this.length; i++) {
                var m = this.at(i);
                items.push(m.export());
            }
            return items;
        },
        import: function(items, parentView) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var col = _.clone(item);
                delete col.items;
                var controlModel = window.desUIControlsListViewInstance.getUIControl(item.type);
                var view = new controlModel.classes.View({
                    model: new controlModel.classes.Config({uuid:item.uuid})
                });
                window.desUIEditorMobileViewInstance.insert(view);
                view.model.set(col);
                view.focus();
                view.model.items.import(item.items, view);
                parentView.focus();
            }
        },
        buildCSS:function(){
            var css = [];
            for (var i = 0; i < this.length; i++) {
                var m = this.at(i);
                css.push(m.buildCSS());
            }
            return css.join("\r\n");
        }
    })
    Backbone.Designer = {
        View: View,
        Config: Config,
        Items: Items
    };
});
