jQuery(function($) {
    var desUIControlsStyleView = Backbone.View.extend({
        initialize : function() {
        },
        el : '#desUIControlsStyle',
        events : {
            "click .reset":function(e) {
                var bind = $(e.target).data("bind");
                var arr = bind.split(",");
                for(var i in arr){
                    this.model.set(arr[i],undefined);
                }
            }
        },
        bindings : {
            "#pro_con_style_color" : {
                observe : "style_color",
                events : ["blur"],
            },
            "#pro_con_style_bgcolor" : {
                observe : "style_background_color",
                events : ["blur"],
            },
            "#pro_con_style_border_radius" : {
                observe : "style_border_radius",
                events : ["blur"],
            },
            "#pro_con_padding_top" : {
                observe : "style_padding",
                events : ["blur"],
                onGet : function(vals) {
                    var padding = this.model.get("style_padding");
                    return padding?padding.top:0;
                },
                onSet : function(vals) {
                    var padding = _.clone(this.model.get("style_padding")) || {};
                    padding.top = parseInt(vals);
                    return padding;
                }
            },
            "#pro_con_padding_right" : {
                observe : "style_padding",
                events : ["blur"],
                onGet : function(vals) {
                    var padding = this.model.get("style_padding");
                    return padding?padding.right:0;
                },
                onSet : function(vals) {
                    var padding = _.clone(this.model.get("style_padding")) || {};
                    padding.right = parseInt(vals);
                    return padding;
                }
            },
            "#pro_con_padding_bottom" : {
                observe : "style_padding",
                events : ["blur"],
                onGet : function(vals) {
                    var padding = this.model.get("style_padding");
                    return padding?padding.bottom:0;
                },
                onSet : function(vals) {
                    var padding = _.clone(this.model.get("style_padding")) || {};
                    padding.bottom = parseInt(vals);
                    return padding;
                }
            },
            "#pro_con_padding_left" : {
                observe : "style_padding",
                events : ["blur"],
                onGet : function(vals) {
                    var padding = this.model.get("style_padding");
                    return padding?padding.left:0;
                },
                onSet : function(vals) {
                    var padding = _.clone(this.model.get("style_padding")) || {};
                    padding.left = parseInt(vals);
                    return padding;
                }
            },
            "#pro_con_margin_top" : {
                observe : "style_margin",
                events : ["blur"],
                onGet : function(vals) {
                    var margin = this.model.get("style_margin");
                    return margin?margin.top:0;
                },
                onSet : function(vals) {
                    var margin = _.clone(this.model.get("style_margin")) || {};
                    margin.top = parseInt(vals);
                    return margin;
                }
            },
            "#pro_con_margin_right" : {
                observe : "style_margin",
                events : ["blur"],
                onGet : function(vals) {
                    var margin = this.model.get("style_margin");
                    return margin?margin.right:0;
                },
                onSet : function(vals) {
                    var margin = _.clone(this.model.get("style_margin")) || {};
                    margin.right = parseInt(vals);
                    return margin;
                }
            },
            "#pro_con_margin_bottom" : {
                observe : "style_margin",
                events : ["blur"],
                onGet : function(vals) {
                    var margin = this.model.get("style_margin");
                    return margin?margin.bottom:0;
                },
                onSet : function(vals) {
                    var margin = _.clone(this.model.get("style_margin")) || {};
                    margin.bottom = parseInt(vals);
                    return margin;
                }
            },
            "#pro_con_margin_left" : {
                observe : "style_margin",
                events : ["blur"],
                onGet : function(vals) {
                    var margin = this.model.get("style_margin");
                    return margin?margin.left:0;
                },
                onSet : function(vals) {
                    var margin = _.clone(this.model.get("style_margin")) || {};
                    margin.left = parseInt(vals);
                    return margin;
                }
            },
            "#pro_con_border_top_width" : "style_border_top",
            "#pro_con_border_right_width" : "style_border_right",
            "#pro_con_border_bottom_width" : "style_border_bottom",
            "#pro_con_border_left_width" : "style_border_left",
            "#pro_con_border_color" : {
                observe : "style_border_color",
                events : ["blur"],
            },
            "#pro_con_border_type" : "style_border_style",
            "#pro_con_bg_img" : {
                events : ["blur"],
                observe : "style_background_image"
                // onGet : function(vals) {
                    // if (vals.indexOf("http") != 0 && vals.indexOf("file://") != 0) {
                        // var f = $.getUrlParam("workspace");
                        // var p = (("file:///" + f + "\\" + vals).replace(/\\/g, "/"));
                        // return p;
                    // }
                    // return f;
                // }
            },
            "#pro_con_bg_img_type" : "style_background_size",
            "#pro_con_style_font_size" : "style_font_size"
        },
        bind : function(control) {
            this.unstickit();
            this.model = control.model;
            this.stickit();
        }
    });
    window.desUIControlsStyleViewInstance = new desUIControlsStyleView();
});

