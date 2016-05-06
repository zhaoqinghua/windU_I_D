//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/base.html");
    var View = Backbone.View.extend({//options...
        initialize : function(option) {
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
                hoverClass : "ui_control_draggable",
                tolerance : "intersect",
                greedy : true,
                drop : function(e, ui) {
                    if (ui.draggable.length) {
                        var view = ui.draggable[0].view;
                        if (self.$el[0] == $(ui.draggable).parent()[0]) {
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
            this.$el.draggable({
                start : function(event, ui) {
                    $(ui.helper).css("z-index", 10000);
                },
                stop : function(event, ui) {
                    $(ui.helper).css("z-index", "");
                },
                drag : function(event, ui) {
                    if (self.model.get("on/off_offset")) {
                        self.$el.css('cursor', 'move');
                        //self.model.set("offset_x", ui.position.left,{silent: true});
                        //self.model.set("offset_y", ui.position.top,{silent: true});
                    }
                    event.stopPropagation();
                }
            });
            this.$el.draggable(this.model.get("on/off_offset") ? "enable" : "disable");
            //this.resize(this.$el,0,0,1,1,"move");
            this.resize();

            // this.resize($("[data-pos='lt']", this.$focus), 1, 1, 1, 1, "nw-resize");
            // this.resize($("[data-pos='lc']", this.$focus), 1, 0, 1, 0, "w-resize");
            // this.resize($("[data-pos='lb']", this.$focus), 1, -1, 1, 0, "sw-resize");
            // this.resize($("[data-pos='ct']", this.$focus), 0, 1, 0, 1, "n-resize");
            // this.resize($("[data-pos='cb']", this.$focus), 0, -1, 0, 0, "s-resize");
            // this.resize($("[data-pos='rt']", this.$focus), -1, 1, 0, 1, "ne-resize");
            // this.resize($("[data-pos='rc']", this.$focus), -1, 0, 0, 0, "e-resize");
            // this.resize($("[data-pos='rb']", this.$focus), -1, -1, 0, 0, "se-resize");

            this.listenTo(this.model, "change:uuid", function(data) {
                this.$el.attr("id", data.changed.uuid);
            });
            this.listenTo(this.model, "change:size_w", function(data) {
                _.isNumber(data.changed.size_w) && this.$el.css("width", (data.changed.size_w ) / 24 + "em");
                _.isString(data.changed.size_w) && this.$el.css("width",data.changed.size_w); 
                data.changed.size_w === undefined && this.$el.css("width", "");
            })
            this.listenTo(this.model, "change:size_h", function(data) {
                _.isNumber(data.changed.size_h) && this.$el.css("height", (data.changed.size_h ) / 24 + "em");
                _.isString(data.changed.size_h) && this.$el.css("height",data.changed.size_h);
                data.changed.size_h === undefined && this.$el.css("height", "");
            })
            this.listenTo(this.model, "change:offset_x", function(data) {
                _.isNumber(data.changed.offset_x) && this.$el.css("left", (data.changed.offset_x ) / 24 + "em");
                _.isString(data.changed.offset_x) && this.$el.css("left", (data.changed.offset_x ));
                data.changed.offset_x === undefined && this.$el.css("left", "");
            })
            this.listenTo(this.model, "change:offset_y", function(data) {
                _.isNumber(data.changed.offset_y) && this.$el.css("top", (data.changed.offset_y ) / 24 + "em");
                _.isString(data.changed.offset_y) && this.$el.css("top", (data.changed.offset_y ));
                data.changed.offset_y === undefined && this.$el.css("top", "");
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
            })
            this.listenTo(this.model, "change:style_border", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var border = data.changed.style_border;
                var style = border.width + "px " + border.type + " " + border.color;
                self.$el.css("border", style);
            })
            this.listenTo(this.model, "change:style_border_radius", function(data) {
                var border = data.changed.style_border_radius;
                var style = parseInt(border) + "px";
                self.$el.css("border-radius", style);
            })
            this.listenTo(this.model, "change:style_background_image", function(data) {
                var img = data.changed.style_background_image;
                if (img) {
                    self.$el.css("background-image", "url(" + img + ")");
                } else {
                    self.$el.css("background-image", "");
                }
            })
            this.listenTo(this.model, "change:style_background_size", function(data) {
                var imgSize = data.changed.style_background_size;
                self.$el.removeClass("ub-img ub-img1");
                if (imgSize) {
                    self.$el.addClass(imgSize);
                }
            })
        },
        template : Template, //VIEW对应的模板
        render : function() {
            /*            this.$focus = $(Template(this.model.toJSON()));
             $("[data-control='BASE']", this.$focus).hide();
             this.$el.prepend(this.$focus);*/
            this.$el.attr("id", this.model.get("uuid"));
            this.$el[0].view = this;
            return this;
        },
        focus : function() {
            var self = this;
            $("[data-control-focus]").removeAttr("data-control-focus");
            self.$el.attr("data-control-focus", "");
            window.desUIEditorMobileViewInstance.$current = self;
            window.desUIControlsPropertiesViewInstance.bind(self);
            window.desUIControlsCustomPropertiesViewInstance.bind(self);
            window.desUIControlsStyleViewInstance.bind(self);
            window.desTemplateRootViewInstance.focusItem(self);
        },
        resize : function() {
            var self = this;
            var _move = false;
            var _hover = false;
            var _x,
                _y;
            var zx = 0,
                zy = 0,
                lx = 0,
                ly = 0;
            var w = this.$el.width();
            var h = this.$el.height();
            var offset = this.$el.offset();
            offset.right = offset.left + w;
            offset.bottom = offset.top + h;

            self.$el.hover(function(e) {
                _hover = true;
            }, function(e) {
                _hover = false;
                self.$el.css('cursor', 'default');
            }).click(function() {
            }).mousedown(function(e) {
                if (zx != 0 || zy != 0 || lx != 0 || ly != 0) {
                    _move = true;
                    _x = e.pageX;
                    _y = e.pageY;
                    e.stopPropagation();
                    this._resizing = true;
                } else
                    self.$el.css('cursor', 'move');
            });
            $(document).mousemove(function(e) {
                if (_move) {
                    var dx = e.pageX - _x;
                    var dy = e.pageY - _y;
                    if (self.model.get("on/off_size")) {
                        var w = (self.model.get("size_w") || self.$el.width()) - zx * dx;
                        var h = (self.model.get("size_h") || self.$el.height()) - zy * dy;
                        zx && self.model.set("size_w", w);
                        zy && self.model.set("size_h", h);
                    }
                    if (self.model.get("on/off_offset")) {
                        var pos = self.$el.position();
                        var left = self.model.get("offset_x") || pos.left;
                        var top = self.model.get("offset_y") || pos.top;
                        ly && (top += ( ly ? ly * dy : 0));
                        lx && (left += ( lx ? lx * dx : 0));

                        lx && self.model.set("offset_x", left);
                        ly && self.model.set("offset_y", top);
                    }
                    console.log(left, top, w, h);
                    _x = e.pageX;
                    _y = e.pageY;
                } else {
                    if (window.desUIEditorMobileViewInstance.$current != self)
                        return;
                    var offset = self.$el.offset();
                    var w = self.$el.width();
                    var h = self.$el.height();
                    offset.right = offset.left + w;
                    offset.bottom = offset.top + h;
                    self.$el.draggable("disable");
                    if (e.pageX >= offset.left && e.pageX <= offset.left + 10) {
                        if (e.pageY >= offset.top && e.pageY <= offset.top + 10) {
                            self.$el.css('cursor', 'nw-resize');
                            zx = 1;
                            zy = 1;
                            lx = 1;
                            ly = 1;
                        } else if (e.pageY > offset.top + 10 && e.pageY < offset.bottom - 10) {
                            self.$el.css('cursor', 'w-resize');
                            zx = 1;
                            zy = 0;
                            lx = 1;
                            ly = 0;
                        } else if (e.pageY >= offset.bottom - 10 && e.pageY <= offset.bottom) {
                            self.$el.css('cursor', 'sw-resize');
                            zx = 1;
                            zy = -1;
                            lx = 1;
                            ly = 0;
                        } else {
                            self.$el.css('cursor', 'default');
                            zx = 0;
                            zy = 0;
                            lx = 0;
                            ly = 0;
                            self.$el.draggable("enable");
                        }
                    } else if (e.pageX > offset.left + 10 && e.pageX <= offset.right - 10) {
                        if (e.pageY >= offset.top && e.pageY <= offset.top + 10) {
                            self.$el.css('cursor', 'n-resize');
                            zx = 0;
                            zy = 1;
                            lx = 0;
                            ly = 1;
                        } else if (e.pageY < offset.bottom - 10 && e.pageY > offset.top + 10) {
                            self.$el.css('cursor', 'default');
                            zx = 0;
                            zy = 0;
                            lx = 0;
                            ly = 0;
                            self.$el.draggable("enable");
                        } else if (e.pageY >= offset.bottom - 10 && e.pageY <= offset.bottom) {
                            self.$el.css('cursor', 's-resize');
                            zx = 0;
                            zy = -1;
                            lx = 0;
                            ly = 0;
                        } else {
                            self.$el.css('cursor', 'default');
                            zx = 0;
                            zy = 0;
                            lx = 0;
                            ly = 0;
                            self.$el.draggable("enable");
                        }
                    } else if (e.pageX >= offset.right - 10 && e.pageX <= offset.right) {
                        if (e.pageY >= offset.top && e.pageY <= offset.top + 10) {
                            self.$el.css('cursor', 'ne-resize');
                            zx = -1;
                            zy = 1;
                            lx = 0;
                            ly = 1;
                        } else if (e.pageY > offset.top + 10 && e.pageY < offset.bottom - 10) {
                            self.$el.css('cursor', 'e-resize');
                            zx = -1;
                            zy = 0;
                            lx = 0;
                            ly = 0;
                        } else if (e.pageY >= offset.bottom - 10 && e.pageY <= offset.bottom) {
                            self.$el.css('cursor', 'se-resize');
                            zx = -1;
                            zy = -1;
                            lx = 0;
                            ly = 0;
                        } else {
                            self.$el.css('cursor', 'default');
                            zx = 0;
                            zy = 0;
                            lx = 0;
                            ly = 0;
                            self.$el.draggable("enable");
                        }
                    }
                }
            }).mouseup(function() {
                self.$el.css('cursor', 'default');
                _move = false;
                this._resizing = false;
            });
        }
    });

    var Config = Backbone.Model.extend({
        initialize : function() {
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

            this.set("style_padding", {
                top : 0,
                left : 0,
                right : 0,
                bottom : 0
            });
            this.set("style_margin", {
                top : 0,
                left : 0,
                right : 0,
                bottom : 0
            });
            this.set("style_border", {
                width : 0,
                color : "rgb(0,0,0)",
                type : "solid"
            });
            this.set("style_border_radius", 0);
            this.set("style_background_color", "");
            this.set("style_background_image", "");
            this.set("style_background_size", "");
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
        idAttribute : "uuid",
        extOptions : [],
        export : function() {
            var control = this.toJSON();
            control.items = this.items.export();
            return control;
        },
        buildCSS : function() {
            var css = [];
            css.push("#" + this.get("uuid") + "{");
            var padding = this.get("style_padding");
            (padding.left || padding.top || padding.right || padding.bottom) && (css.push("\tpadding:" + padding.top + "px " + padding.right + "px " + padding.bottom + "px " + padding.left + "px;"));
            var margin = this.get("style_margin");
            (margin.left || margin.top || margin.right || margin.bottom) && (css.push("\tmargin:" + margin.top + "px " + margin.right + "px " + margin.bottom + "px " + margin.left + "px;"));
            css.push("}");
            if (css.length == 2)
                css = [];
            css.push(this.items.buildCSS());
            return css.join("\r\n");

        }
    })

    var Items = Backbone.Collection.extend({
        model : Config,
        initialize : function() {

        },
        export : function() {
            var items = [];
            for (var i = 0; i < this.length; i++) {
                var m = this.at(i);
                items.push(m.export());
            }
            return items;
        },
        import : function(items, parentView) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var col = _.clone(item);
                delete col.items;
                var controlModel = window.desUIControlsListViewInstance.getUIControl(item.type);
                var view = new controlModel.classes.View({
                    model : new controlModel.classes.Config({
                        uuid : item.uuid
                    })
                });
                window.desUIEditorMobileViewInstance.insert(view);
                view.model.set(col);
                view.focus();
                view.model.items.import(item.items, view);
                parentView.focus();
            }
        },
        buildCSS : function() {
            var css = [];
            for (var i = 0; i < this.length; i++) {
                var m = this.at(i);
                css.push(m.buildCSS());
            }
            return css.join("\r\n");
        }
    })
    Backbone.Designer = {
        View : View,
        Config : Config,
        Items : Items
    };
});
