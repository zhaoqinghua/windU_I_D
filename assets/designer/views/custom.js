jQuery(function($) {

    var pro_templates = {
        "select" : loadTemplate("../assets/designer/views/template/pro_select.html"),
        "input" : loadTemplate("../assets/designer/views/template/pro_input.html"),
        "checkbox" : loadTemplate("../assets/designer/views/template/pro_checkbox.html"),
        "icon" : loadTemplate("../assets/designer/views/template/pro_icon.html"),
        "textarea" : loadTemplate("../assets/designer/views/template/pro_textarea.html"),
        "label" : loadTemplate("../assets/designer/views/template/pro_label.html"),
        "data-bind" : loadTemplate("../assets/designer/views/template/pro_data_bind.html"),
        "events-bind" : loadTemplate("../assets/designer/views/template/pro_events_bind.html"),
        "none": loadTemplate("../assets/designer/views/template/pro_none.html")
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
            var self = this;
            var options = this.model.extOptions;
            var $ext = $("#pro_ext_options", this.$el);
            for (var i in options) {
                var option = _.clone(options[i]);
                option.tip = option.tip ? option.tip : "";
                option.scope = this.model.scopeViewModel();
                option.icon = option.icon ? option.icon : "";
                var template = pro_templates[option.type];
                var $pro_el = $(template(option));
                if(option.icon){
                    $(".action",$pro_el).on("click",function(){
                        self.model.view.trigger("action:"+$(this).attr("data-custom-action"),{});
                    })
                }
                $ext.append($pro_el);
                switch(option.type) {
                case "none":
                    break;
                case "input":
                    this.addBinding(null, "#pro_" + option.name, {
                        "observe" : option.name,
                        "events" : ["blur"]
                    });
                    break;
                case "textarea":
                    this.addBinding(null, "#pro_" + option.name, {
                        "observe" : option.name,
                        "events" : ["blur"],
                        "getVal" : function($el, event, options) {
                            options.updateModel = true;
                            return $el[0].env.editor.getValue();
                        },
                        "update" : function($el, val, model, options) {
                            $el[0].env.editor.setValue(val, 1);
                        }
                    });
                    break;
                case "events-bind":
                    this.addBinding(null, "#pro_" + option.name, {
                        "observe" : option.name,
                        "events" : ["blur"],
                        "getVal" : function($el, event, options) {
                            options.updateModel = true;
                            return $el[0].env.editor.getValue();
                        },
                        "update" : function($el, val, model, options) {
                            $el[0].env.editor.setValue(val, 1);
                        }
                    });
                    break;
                case "data-bind":
                    this.addBinding(null, "#pro_" + option.name, {
                        "observe" : option.name,
                        "events" : ["blur"],
                        "getVal" : function($el, event, options) {
                            options.updateModel = true;
                            var res = $el[0].env.editor.getValue();
                            var arr = res.split("\r\n");
                            var dest = {};
                            for (var i in arr) {
                                try {
                                    var sp = arr[i].indexOf(":{")
                                    var item = (sp == -1 ? arr[i].split(":") : arr[i].split(":{"));
                                    var val = dest[item[0]];
                                    switch(item[0]) {
                                    case "":
                                        break;
                                    case "attr":
                                    case "classes":
                                    case "css":
                                        dest[item[0]] = (!val ? item[1].replace("}", "") : (dest[item[0]] + "," + item[1].replace("}", "")));
                                        break;
                                    default:
                                        dest[item[0]] = item[1];
                                        break;
                                    }
                                    
                                } catch(e) {

                                }
                            }
                            arr = [];
                            for (var i in dest) {
                                var str = dest[i];
                                switch(i) {
                                case "":
                                    break;
                                case "attr":
                                case "classes":
                                case "css":
                                    arr.push(i + ":{" + str + "}");
                                    break;
                                default:
                                    arr.push(i + ":" + str);
                                    break;
                                }
                            }
                            return arr;
                        },
                        "update" : function($el, val, model, options) {
                            var arr = _.isArray(val) ? val : [];
                            $el[0].env.editor.setValue(arr.join("\r\n"), 1);
                        }
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
                case "label":

                    break;
                default:
                    this.addBinding(null, "#pro_" + option.name, option.name);
                    break;
                }
            }
        }
    });
    window.desUIControlsCustomPropertiesViewInstance = new desUIControlsCustomPropertiesView();
    window.mvvm = {
        getViewModels : function() {
            var vms = window.desUIEditorMobileViewInstance.getViewModels();
            var res = [{
                val : "",
                lab : ""
            }];
            _.each(vms, function(vm) {
                var item = {
                    val : vm.get("uuid"),
                    lab : vm.get("uuid")
                };
                res.push(item);
            })
            return res;
        },
        getModels : function() {
            var models = window.desUIEditorMobileViewInstance.getModels();
            var res = [{
                val : "",
                lab : ""
            }];
            _.each(models, function(model) {
                var item = {
                    val : model.get("uuid"),
                    lab : model.get("uuid")
                };
                res.push(item);
            })
            return res;
        },
        getCollections : function() {
            var collections = window.desUIEditorMobileViewInstance.getCollections();
            var res = [{
                val : "",
                lab : ""
            }];
            _.each(collections, function(collection) {
                var item = {
                    val : collection.get("uuid"),
                    lab : collection.get("uuid")
                };
                res.push(item);
            })
            return res;
        },
        getDoms : function() {
            var doms = window.desUIEditorMobileViewInstance.getDoms();
            var res = [{
                val : "",
                lab : ""
            }];
            _.each(doms, function(dom) {
                var item = {
                    val : dom.get("uuid"),
                    lab : dom.get("uuid")
                };
                res.push(item);
            })
            return res;
        }
    }
});

