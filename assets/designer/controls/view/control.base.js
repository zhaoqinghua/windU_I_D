//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/base.html");
    function isNum(val) {
        var a = parseInt(val) != Number.NaN;
        var b = (parseInt(val).toString() == val);
        return a && b;
    }

    var View = Backbone.View.extend({//options...
        getParent : function(ele) {
            if ($(ele).parent().attr("data-control"))
                return $(ele).parent();
            else
                return this.getParent($(ele).parent());
        },
        initialize : function(option) {
            function toFixed(num) {
                return num ? (num / 16).toFixed(2) + "em " : "0em ";
            }

            var self = this;
            this.model.view = this;
            this.$el.on("click", function(e) {
                e.stopPropagation();
                self.focus();
            })
            this.$el.on("mousedown", function(e) {
                if (!self.model.get("viewState"))
                    return;
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
                        if (view.verifyParent && !view.verifyParent(self))
                            return;
                        if (self.$el[0] == view.getParent($(ui.draggable))[0]) {
                            var pos = ui.position;
                            if (view.model.get("on/off_offset")) {
                                view.model.set("offset_x", parseInt(pos.left));
                                view.model.set("offset_y", parseInt(pos.top));
                            }
                            return;
                        }
                        view.model.collection.remove(view.model);
                        self.model.items.add(view.model);
                        var offset = ui.offset;
                        if (self.appendChild)
                            self.appendChild(ui.draggable);
                        else
                            self.$el.append(ui.draggable);

                        $(ui.draggable).offset(offset);
                        var pos = view.$el.position();
                        view.model.set("offset_x", parseInt(pos.left), {
                            silent : true
                        });
                        view.model.set("offset_y", parseInt(pos.top), {
                            silent : true
                        });
                    }

                },
                over : function(e, ui) {
                    e.stopPropagation();
                }
            });
            this.model.get("on/off_draggable") && this.$el.draggable({
                start : function(event, ui) {
                    $(ui.helper).css("z-index", 10000);
                },
                stop : function(event, ui) {
                    $(ui.helper).css("z-index", "");
                },
                drag : function(event, ui) {
                    if (!self.model.get("on/off_offset") || !self.model.get("viewState")) {
                        return false;
                        //self.model.set("offset_x", ui.position.left,{silent: true});
                        //self.model.set("offset_y", ui.position.top,{silent: true});
                    }
                    self.$el.css('cursor', 'move');
                    event.stopPropagation();
                },
                snap : true
            });
            this.model.get("on/off_draggable") && this.$el.draggable(this.model.get("on/off_offset") ? "enable" : "disable");
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
            this.listenTo(this.model, "change:viewState", function(data) {
                if (this.model.get("on/off_draggable")) {
                    this.$el.draggable(data.changed.viewState ? "enable" : "disable");
                }
                this.model.items.design(data.changed.viewState);
            })
            this.listenTo(this.model, "change:uuid", function(data) {
                this.$el.attr("id", data.changed.uuid);
            });
            this.listenTo(this.model, "change:size_w", function(data) {
                isNum(data.changed.size_w) && (this.$el.css("width", toFixed(data.changed.size_w)), this.model.css["width"] = toFixed(data.changed.size_w));
                !isNum(data.changed.size_w) && (this.$el.css("width", data.changed.size_w), this.model.css["width"] = data.changed.size_w);
                data.changed.size_w === undefined && this.$el.css("width", "");
            })
            this.listenTo(this.model, "change:size_h", function(data) {
                isNum(data.changed.size_h) && (this.$el.css("height", toFixed(data.changed.size_h)), this.model.css["height"] = toFixed(data.changed.size_h));
                !isNum(data.changed.size_h) && (this.$el.css("height", data.changed.size_h), this.model.css["height"] = data.changed.size_h);
                data.changed.size_h === undefined && this.$el.css("height", "");
            })
            this.listenTo(this.model, "change:offset_x", function(data) {
                isNum(data.changed.offset_x) && (this.$el.css("left", toFixed(data.changed.offset_x)), this.model.css["left"] = toFixed(data.changed.offset_x));
                !isNum(data.changed.offset_x) && (this.$el.css("left", (data.changed.offset_x )), this.model.css["left"] = data.changed.offset_x);
                data.changed.offset_x === undefined && this.$el.css("left", "");
            })
            this.listenTo(this.model, "change:offset_y", function(data) {
                isNum(data.changed.offset_y) && (this.$el.css("top", toFixed(data.changed.offset_y)), this.model.css["top"] = toFixed(data.changed.offset_y));
                !isNum(data.changed.offset_y) && (this.$el.css("top", (data.changed.offset_y )), this.model.css["top"] = data.changed.offset_y);
                data.changed.offset_y === undefined && this.$el.css("top", "");
            })

            this.listenTo(this.model, "change:position", function(data) {
                switch (data.changed.position) {
                case "absolute":
                    self.$el.css("position", "");
                    self.$el.addClass("uab");
                    this.model.cla["uab"] = true;
                    break;
                default:
                    self.$el.css("position", "");
                    self.$el.removeClass("uab");
                    this.model.cla["uab"] = false;
                    break;
                }
            });
            this.listenTo(this.model, "change:layout", function(data) {
                var $el = self.$el;
                switch (data.changed.layout) {
                case "box":
                    $el.css("display", "");
                    $el.addClass("ub");
                    this.model.cla["ub"] = true;
                    break;
                default:
                    $el.css("display", "");
                    $el.removeClass("ub");
                    this.model.cla["ub"] = false;
                    break;
                }
            });
            this.listenTo(this.model, "change:flex", function(data) {
                self.$el.removeClass("ub-f1 ub-f2 ub-f3 ub-f4 ub-f5 ub-f6 ub-f7");
                self.$el.addClass(data.changed.flex);
                this.model.cla["ub-f1"] = this.model.cla["ub-f2"] = this.model.cla["ub-f3"] = this.model.cla["ub-f4"] = this.model.cla["ub-f5"] = this.model.cla["ub-f6"] = $this.model.cla["ub-f7"] = false;
                this.model.cla[data.changed.flex] = true;
            });
            this.listenTo(this.model, "change:on/off_offset", function(data) {
                this.model.get("on/off_draggable") && self.$el.draggable(data.changed["on/off_offset"] ? "enable" : "disable");
            });
            this.listenTo(this.model, "change:layout_pack", function(data) {
                var $el = self.$el;
                $el.removeClass("ub-pc ub-pe ub-pj");
                $el.addClass(data.changed.layout_pack);
                this.model.cla["ub-pc"] = this.model.cla["ub-pe"] = this.model.cla["ub-pj"] = false;
                this.model.cla[data.changed.layout_pack] = true;
            });
            this.listenTo(this.model, "change:layout_align", function(data) {
                var $el = self.$el;
                $el.removeClass("ub-ac ub-ae");
                $el.addClass(data.changed.layout_align);

                this.model.cla["ub-ac"] = this.model.cla["ub-ae"] = false;
                this.model.cla[data.changed.layout_align] = true;
            });
            this.listenTo(this.model, "change:layout_orient", function(data) {
                var $el = self.$el;
                $el.removeClass("ub-ver");
                $el.addClass(!data.changed.layout_orient ? "" : "ub-ver");
                this.model.cla["ub-ver"] = !(!data.changed.layout_orient);
            })
            this.listenTo(this.model, "change:layout_dir", function(data) {
                var $el = self.$el;
                $el.removeClass("ub-rev");
                $el.addClass(!data.changed.layout_dir ? "" : "ub-rev");
                this.model.cla["ub-rev"] = !(!data.changed.layout_dir);
            })
            this.listenTo(this.model, "change:css", function(data) {
                self.$el.removeClass(this.model.previous("css"));
                self.$el.addClass(data.changed.css);
                this.model.cla[this.model.previous("css")] = false;
                this.model.cla[data.changed.css] = true;
            })

            this.listenTo(this.model, "change:style_background_color", function(data) {
                !data.changed.style_background_color && self.$el.css("background-color", "");
                data.changed.style_background_color && self.$el.css("background-color", data.changed.style_background_color);
                this.model.css["background-color"] = data.changed.style_background_color;
            })
            this.listenTo(this.model, "change:style_color", function(data) {
                !data.changed.style_color && self.$el.css("color", "");
                data.changed.style_color && self.$el.css("color", data.changed.style_color);
                this.model.css["color"] = data.changed.style_color;
            })
            this.listenTo(this.model, "change:style_padding", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var padding = data.changed.style_padding;
                if (padding) {
                    var style = toFixed(padding.top) + toFixed(padding.right) + toFixed(padding.bottom) + toFixed(padding.left);
                    self.$el.css("padding", style);
                } else
                    self.$el.css("padding", "");
                this.model.css["padding"] = style;
            })
            this.listenTo(this.model, "change:style_margin", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var margin = data.changed.style_margin;
                if (margin) {
                    var style = toFixed(margin.top) + toFixed(margin.right) + toFixed(margin.bottom) + toFixed(margin.left);
                    self.$el.css("margin", style);
                } else {
                    self.$el.css("margin", "");
                }
                this.model.css["margin"] = style;
            })
            this.listenTo(this.model, "change:style_border_top", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var border = data.changed.style_border_top;
                var style = border + "px ";
                self.$el.css("border-top-width", border ? style : "");
                this.model.css["border-top-width"] = style;
            })
            this.listenTo(this.model, "change:style_border_right", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var border = data.changed.style_border_right;
                var style = border + "px ";
                self.$el.css("border-right-width", border ? style : "");
                this.model.css["border-right-width"] = style;
            })
            this.listenTo(this.model, "change:style_border_bottom", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var border = data.changed.style_border_bottom;
                var style = border + "px ";
                self.$el.css("border-bottom-width", border ? style : "");
                this.model.css["border-bottom-width"] = style;
            })
            this.listenTo(this.model, "change:style_border_left", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var border = data.changed.style_border_left;
                var style = border + "px ";
                self.$el.css("border-left-width", border ? style : "");
                this.model.css["border-left-width"] = style;
            })
            this.listenTo(this.model, "change:style_border_color", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var color = data.changed.style_border_color;
                self.$el.css("border-color", color ? color : "");
                this.model.css["border-color"] = color;
            })
            this.listenTo(this.model, "change:style_border_style", function(data) {
                //self.$el.css("background-color",data.changed.style_background_color);
                var style = data.changed.style_border_style;
                self.$el.css("border-style", style);
                this.model.css["border-style"] = style;
            })
            this.listenTo(this.model, "change:style_border_radius", function(data) {
                var border = data.changed.style_border_radius;
                if (border) {
                    var style = parseInt(border) + "px";
                    self.$el.css("border-radius", style);
                } else
                    self.$el.css("border-radius", "");
                this.model.css["border-radius"] = style;
            })
            this.listenTo(this.model, "change:style_background_image", function(data) {
                var img = data.changed.style_background_image;
                if (img) {
                    if (img.indexOf("http") != 0 && img.indexOf("file://") != 0) {
                        var work = $.getUrlParam("workspace");
                        var f = $.getUrlParam("path");
                        var relative = PathModule.relative(f, work);
                        this.model.css["background-image"] = "url(" + relative + "../" + img + ")";
                        //because dest css file in next level directory. so that,we should add ../
                        img = (("file:///" + work + "\\" + img).replace(/\\/g, "/"));
                    } else
                        this.model.css["background-image"] = "url(" + img + ")";
                    self.$el.css("background-image", "url(" + img + ")");

                } else {
                    self.$el.css("background-image", "");
                    this.model.css["background-image"] = self.$el.css("background-image");
                }

            })
            this.listenTo(this.model, "change:style_background_size", function(data) {
                var imgSize = data.changed.style_background_size;
                self.$el.removeClass("ub-img ub-img1");
                this.model.cla["ub-img"] = this.model.cla["ub-img1"] = false;
                if (imgSize) {
                    self.$el.addClass(imgSize);
                    this.model.cla[imgSize] = true;
                }
            })
            this.listenTo(this.model, "change:style_font_size", function(data) {
                var fontSize = data.changed.style_font_size;
                self.$el.css("font-size", "");
                this.model.css["font-size"] = "";
                if (fontSize) {
                    self.$el.css("font-size", fontSize + "em");
                    this.model.css["font-size"] = fontSize + "em";
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
                $(".control_info").text("w:" + self.$el.width() + "px" + " h:" + self.$el.height() + "px")
            }).mousedown(function(e) {
                if (!self.model.get("viewState"))
                    return;
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
                if (!self.model.get("viewState"))
                    return;
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
                    self.model.get("on/off_draggable") && self.$el.draggable("disable");
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
                            self.model.get("on/off_draggable") && self.$el.draggable("enable");
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
                            self.model.get("on/off_draggable") && self.$el.draggable("enable");
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
                            self.model.get("on/off_draggable") && self.$el.draggable("enable");
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
                            self.model.get("on/off_draggable") && self.$el.draggable("enable");
                        }
                    }
                }
            }).mouseup(function() {
                if (!self.model.get("viewState"))
                    return;
                self.$el.css('cursor', 'default');
                _move = false;
                this._resizing = false;
            });
        }
    });

    var Config = Backbone.Model.extend({
        initialize : function() {
            this.css = {};
            this.cla = {};
            var uuid = this.get("uuid");
            uuid || this.set("uuid", this.get("type") + "_" + getUUID());
            this.set("viewState", true);
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
            this.set("style_border_top", 0);
            this.set("style_border_right", 0);
            this.set("style_border_bottom", 0);
            this.set("style_border_left", 0);
            this.set("style_border_style", "");
            this.set("style_border_color", "");
            this.set("style_border_radius", 0);
            this.set("style_background_color", "");
            this.set("style_color", "");
            this.set("style_background_image", "");
            this.set("style_background_size", "");
            this.set("style_font_size", "");
            //
            this.set("project", "");
            this.set("private", "");
            this.set("custom", {});

            this.set("on/off_flex", true);
            this.set("on/off_layout", true);
            this.set("on/off_offset", true);
            this.set("on/off_size", true);
            this.set("on/off_dropable", true);
            this.set("on/off_draggable", true);
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
            var out = [];
            out.push("#" + this.get("uuid") + "{");
            for (var i in this.css) {
                this.css[i] && out.push(i + ":" + this.css[i] + ";");
            }
            out.push("}");
            if (out.length == 2)
                out = [];
            out.push(this.items.buildCSS());
            return out.join("\r\n");

        },
        buildJS : function() {
            var out = [];
            if (this.view.buildJS) {
                out.push(this.view.buildJS());
            } else if (this.view.jsTemplate) {
                out.push(this.view.jsTemplate(this.attributes));
            }
            out.push(this.items.buildJS());
            return out.join("\r\n");
        },
        buildHTML : function() {
            var dom = $(this.view.template(this.attributes));
            dom.attr("id", this.get("uuid"));
            for (var i in this.cla) {
                this.cla[i] && dom.addClass(i);
            }
            this.view.appendChild ? this.view.appendChild(this.items.buildHTML(), dom) : dom.append(this.items.buildHTML());
            this.view.buildHTML && this.view.buildHTML(dom);
            return dom;
        },
        getDep : function(deps) {
            if (this.get("dep"))
                deps[this.get("dep")] = true;
            this.items.getDeps(deps);
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
        },
        buildJS : function() {
            var js = [];
            for (var i = 0; i < this.length; i++) {
                var m = this.at(i);
                js.push(m.buildJS());
            }
            return js.join("\r\n");
        },
        buildHTML : function() {
            var con = $("<div></div>");
            for (var i = 0; i < this.length; i++) {
                var m = this.at(i);
                con.append(m.buildHTML());
            }
            return con.children();
        },
        getDeps : function(deps) {
            for (var i = 0; i < this.length; i++) {
                var m = this.at(i);
                m.getDep(deps);
            }
        },
        design : function(state) {
            for (var i = 0; i < this.length; i++) {
                this.at(i).set("viewState", state);
            }
        }
    })
    Backbone.Designer = {
        View : View,
        Config : Config,
        Items : Items
    };
});
