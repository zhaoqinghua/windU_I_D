jQuery(function($) {

    var desUIControlsPropertiesView = Backbone.View.extend({
        initialize : function() {
        },
        el : '#desUIControlsProperties',
        events : {
            "click .del-width" : function(e) {
                this.model.unset("size_w");
            },
            "click .del-height" : function(e) {
                this.model.unset("size_h");
            },
            "click .full-width" : function(e) {
                this.model.set("size_w", "100%");
            },
            "click .full-height" : function(e) {
                this.model.set("size_h", "100%");
            },
            "click .del-offset" : function(e) {
                this.model.unset("offset_x");
                this.model.unset("offset_y");
            },
            "click .lock-size" : function(e) {
                var val = !this.model.get("on/off_size");
                this.model.set("on/off_size", val);
                $(e.toElement).removeClass( val ? "fa-lock" : " fa-unlock");
                $(e.toElement).addClass( val ? "fa-unlock" : " fa-lock");
            },
            "click .lock-offset" : function(e) {
                var val = !this.model.get("on/off_offset");
                this.model.set("on/off_offset", val);
                $(e.toElement).removeClass( val ? "fa-lock" : " fa-unlock");
                $(e.toElement).addClass( val ? "fa-unlock" : " fa-lock");
            },
            "click .del-controls" : function(e) {
                if (window.desUIEditorMobileViewInstance.$current != window.desUIEditorMobileViewInstance) {
                    window.desUIEditorMobileViewInstance.removeItem();
                    window.desUIEditorMobileViewInstance.$current = window.desUIEditorMobileViewInstance;
                }
            },
            "click #pro_btn_css" : function(e) {
                var val = $("#pro_con_css").val();
                $("#css-select-form")[0].options = {
                    val : val,
                    input : "#pro_con_css"
                };
                $("#css-select-form").modal();
            }
        },
        bindings : {
            "#pro_con_name" : "uuid",
            "#pro_con_flex" : "flex",
            "#pro_con_position" : "position",
            "#pro_con_layout" : {
                observe : "layout",
                updateView : function(val) {
                    val == "box" && $(".box_layout", this.$el).removeClass("hide");
                    val == "box" || $(".box_layout", this.$el).addClass("hide");
                    return true;
                },
                updateModel : function(val, event, options) {
                    val == "box" && $(".box_layout", this.$el).removeClass("hide");
                    val == "box" || $(".box_layout", this.$el).addClass("hide");
                    return true;
                }
            },
            "#pro_con_size_w" : "size_w",
            "#pro_con_size_h" : "size_h",
            "#pro_con_offset_x" : {
                observe : "offset_x",
                update : function($el, val, model, options) {
                    $el.val(parseInt(val));
                }
            },
            "#pro_con_offset_y" : {
                observe : "offset_y",
                update : function($el, val, model, options) {
                    $el.val(parseInt(val));
                }
            },
            ".lock-offset" : {
                observe : "on/off_offset",
                update : function($el, val, model, options) {
                    $el.removeClass( val ? "fa-lock" : " fa-unlock");
                    $el.addClass( val ? "fa-unlock" : " fa-lock");
                }
            },
            ".lock-size" : {
                observe : "on/off_size",
                update : function($el, val, model, options) {
                    $el.removeClass( val ? "fa-lock" : " fa-unlock");
                    $el.addClass( val ? "fa-unlock" : " fa-lock");
                }
            },
            ".align_hor input" : {
                observe : "layout_pack",
                events : ["change"],
                initialize : function($el, model, options) {
                    $(".box_layout .align_hor > label").removeClass("active");
                    var obj = $(".box_layout [name='box_pack'][value='" + model.get("layout_pack") + "']", this.$el);
                    $(obj.parent()).addClass("active");
                }
            },
            ".align_ver input" : {
                observe : "layout_align",
                events : ["change"],
                initialize : function($el, model, options) {
                    $(".box_layout .align_ver > label").removeClass("active");
                    var obj = $(".box_layout [name='box_align'][value='" + model.get("layout_align") + "']", this.$el);
                    $(obj.parent()).addClass("active");
                }
            },
            "#box_align_orient input" : {
                observe : "layout_orient",
                events : ["change"],
                initialize : function($el, model, options) {
                    $(".box_layout",this.$el).attr("data-layout-orient",model.get("layout_orient"));
                },
                updateModel : function(val, event, options) {
                    $(".box_layout",this.$el).attr("data-layout-orient",val);
                    return true;
                }
            },
            "#box_align_dir input" : {
                observe : "layout_dir",
                events : ["change"],
                initialize : function($el, model, options) {
                    model.get("layout_dir") == "ub-rev" ? $el.parent().addClass("active") : $el.parent().removeClass("");
                }
            },
            "#pro_con_css" : {
                observe : "css",
                events : ["blur"],
                "update" : function($el, val) {
                    var tag_input = $("#pro_con_css", this.$el);
                    var $tag_obj = tag_input.data('tag');
                    for (var i = $tag_obj.values.length - 1; i >= 0; i--) {
                        $tag_obj.remove(i);
                    }
                    if (val) {
                        var items = val.split(",");
                        for (var i in items)
                        $tag_obj.add(items[i]);
                    }

                }
            }
        },
        bind : function(control) {
            this.unstickit();
            this.model = control.model;
            this.stickit();
        },
    });
    window.desUIControlsPropertiesViewInstance = new desUIControlsPropertiesView();
});

