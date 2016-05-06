jQuery(function($) {

    var pro_templates = {
        "select" : loadTemplate("../assets/designer/views/template/pro_select.html"),
        "input" : loadTemplate("../assets/designer/views/template/pro_input.html"),
        "checkbox" : loadTemplate("../assets/designer/views/template/pro_checkbox.html"),
        "icon" : loadTemplate("../assets/designer/views/template/pro_icon.html"),
    }
    var desUIControlsCustomPropertiesView = Backbone.View.extend({
        initialize : function() {
        },
        el : '#desUIControlsCustomProperties',
        events : {
        },
        bindings : {
        },
        bind : function(control) {
            this.unstickit();
            var $ext = $("#pro_ext_options", this.$el);
            $ext.empty();
            this.model = control.model;
            this.stickit();
            this.custom();
        },
        custom : function() {
            var options = this.model.extOptions;
            var $ext = $("#pro_ext_options", this.$el);
            for (var i in options) {
                var option = options[i];
                var template = pro_templates[option.type];
                var $pro_el = $(template(option));
                $ext.append($pro_el);
                switch(option.type) {
                case "input":
                    this.addBinding(null, "#pro_" + option.name, {
                        "observe" : option.name,
                        "events" : ["blur"]
                    });
                    break;
                case "icon":
                    this.addBinding(null, "#pro_" + option.name, {
                        "observe" : option.name,
                        "events" : ["blur"],
                        "update" : function($el, val) {
                            var tag_input = $("#pro_" + option.name);
                            try {
                                tag_input.tag({
                                    placeholder : tag_input.attr('placeholder'),
                                    //enable typeahead by specifying the source array
                                    //source : ace.vars['US_STATES'],//defined in ace.js >> ace.enable_search_ahead
                                })

                                //programmatically add a new
                                var $tag_obj = tag_input.data('tag');
                                if (val) {
                                    var items = val.split(",");
                                    for (var i in items)
                                    $tag_obj.add(items[i]);
                                }
                                tag_input.on("added", function() {
                                    $(this).blur();
                                })
                                tag_input.on("removed", function() {
                                    $(this).blur();
                                })
                            } catch(e) {
                                console.log(e.message)
                            }
                        }
                    });
                    break;
                default:
                    this.addBinding(null, "#pro_" + option.name, option.name);
                    break;
                }
            }
        }
    });
    window.desUIControlsCustomPropertiesViewInstance = new desUIControlsCustomPropertiesView();
});

