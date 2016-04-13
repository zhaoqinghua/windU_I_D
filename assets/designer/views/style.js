jQuery(function($) {
    var desUIControlsStyleView = Backbone.View.extend({
        initialize : function() {
        },
        el : '#desUIControlsStyle',
        events : {

        },
        bindings : {
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
                    return padding.top;
                },
                onSet : function(vals) {
                    var padding = _.clone(this.model.get("style_padding"));
                    padding.top = parseInt(vals);
                    return padding;
                }
            },
            "#pro_con_padding_right" : {
                observe : "style_padding",
                events : ["blur"],
                onGet : function(vals) {
                    var padding = this.model.get("style_padding");
                    return padding.right;
                },
                onSet : function(vals) {
                    var padding = _.clone(this.model.get("style_padding"));
                    padding.right = parseInt(vals);
                    return padding;
                }
            },
            "#pro_con_padding_bottom" : {
                observe : "style_padding",
                events : ["blur"],
                onGet : function(vals) {
                    var padding = this.model.get("style_padding");
                    return padding.bottom;
                },
                onSet : function(vals) {
                    var padding = _.clone(this.model.get("style_padding"));
                    padding.bottom = parseInt(vals);
                    return padding;
                }
            },
            "#pro_con_padding_left" : {
                observe : "style_padding",
                events : ["blur"],
                onGet : function(vals) {
                    var padding = this.model.get("style_padding");
                    return padding.left;
                },
                onSet : function(vals) {
                    var padding = _.clone(this.model.get("style_padding"));
                    padding.left = parseInt(vals);
                    return padding;
                }
            },
            "#pro_con_margin_top" : {
                observe : "style_margin",
                events : ["blur"],
                onGet : function(vals) {
                    var margin = this.model.get("style_margin");
                    return margin.top;
                },
                onSet : function(vals) {
                    var margin = _.clone(this.model.get("style_margin"));
                    margin.top = parseInt(vals);
                    return margin;
                }
            },
            "#pro_con_margin_right" : {
                observe : "style_margin",
                events : ["blur"],
                onGet : function(vals) {
                    var margin = this.model.get("style_margin");
                    return margin.right;
                },
                onSet : function(vals) {
                    var margin = _.clone(this.model.get("style_margin"));
                    margin.right = parseInt(vals);
                    return margin;
                }
            },
            "#pro_con_margin_bottom" : {
                observe : "style_margin",
                events : ["blur"],
                onGet : function(vals) {
                    var margin = this.model.get("style_margin");
                    return margin.bottom;
                },
                onSet : function(vals) {
                    var margin = _.clone(this.model.get("style_margin"));
                    margin.bottom = parseInt(vals);
                    return margin;
                }
            },
            "#pro_con_margin_left" : {
                observe : "style_margin",
                events : ["blur"],
                onGet : function(vals) {
                    var margin = this.model.get("style_margin");
                    return margin.left;
                },
                onSet : function(vals) {
                    var margin = _.clone(this.model.get("style_margin"));
                    margin.left = parseInt(vals);
                    return margin;
                }
            },
            "#pro_con_border_width" : {
                observe : "style_border",
                events : ["blur"],
                onGet : function(vals) {
                    var border = this.model.get("style_border");
                    return border.width;
                },
                onSet : function(vals) {
                    var border = _.clone(this.model.get("style_border"));
                    border.width = parseInt(vals);
                    return border;
                }
            },
            "#pro_con_border_color" : {
                observe : "style_border",
                events : ["blur"],
                onGet : function(vals) {
                    var border = this.model.get("style_border");
                    return border.color;
                },
                onSet : function(vals) {
                    var border = _.clone(this.model.get("style_border"));
                    border.color = vals;
                    return border;
                }
            },
            "#pro_con_border_type" : {
                observe : "style_border",
                onGet : function(vals) {
                    var border = this.model.get("style_border");
                    return border.type;
                },
                onSet : function(vals) {
                    var border = _.clone(this.model.get("style_border"));
                    border.type = vals;
                    return border;
                }
            },
        },
        bind : function(control) {
            this.unstickit();
            this.model = control.model;
            this.stickit();
        }
    });
    window.desUIControlsStyleViewInstance = new desUIControlsStyleView();
});

