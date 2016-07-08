//加载并初始化模板对象
jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/mvvm/viewmodel.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/mvvm/viewmodel.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            var self = this;
            this.render();
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
            this.model.set("initialize", js_beautify("{ return; }", 4, " ", 0));
            this.model.set("modelName", "");
            this.model.set("collectionName", "");
            this.MVVMViewModel = new MVVM.ViewModel({
                $el : this.$el
            });
            function applyBindings() {
                try {
                    self.MVVMViewModel.applyBindings();
                } catch(e) {
                    console.log(e);
                }
            }


            this.listenTo(this.model, "change:modelName", function(data) {
                var models = window.desUIEditorMobileViewInstance.getModels();
                _.each(models, function(model) {
                    if (model.get("uuid") == data.changed.modelName) {
                        if (self.MVVMViewModel.model)
                            self.MVVMViewModel.stopListening(self.MVVMViewModel.model);
                        self.MVVMViewModel.model = model.view.MVVMModel;
                        self.MVVMViewModel.listenTo(self.MVVMViewModel.model, "change", function(data) {
                            applyBindings();
                        })
                        applyBindings();
                    }
                })
            })
            this.listenTo(this.model, "change:viewName", function(data) {
                var views = window.desUIEditorMobileViewInstance.getDoms();
                _.each(views, function(view) {
                    if (view.get("uuid") == data.changed.viewName) {
                        self.MVVMViewModel.$el.view && self.MVVMViewModel.$el.view.model.set("viewModelName", "");
                        view.view.$el[0].view.model.set("viewModelName", self.model.get("uuid"));
                        self.MVVMViewModel.setElement(view.view.$el)
                        applyBindings();
                    }
                })
            })
            this.listenTo(this.model, "change:events", function(data) {
                self.MVVMViewModel.undelegateEvents();
                var out = js_beautify("var events = {" + data.changed.events + "}", 4, " ", 0);
                try {
                    eval(out);
                    self.MVVMViewModel.delegateEvents(events);
                } catch(e) {
                    $.gritter.add({
                        title : '视图交互事件设定异常',
                        text : e,
                        class_name : 'gritter-info gritter-center gritter-light'
                    });
                }

            })
        },
        template : Template, //VIEW对应的模板
        jsTemplate : jsTemplate,
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                Backbone.Designer.View.prototype.render.apply(this, arguments);
            }
            return this;
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "ViewModel");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
        },
        extOptions : [{
            type : "textarea",
            title : "初始化<br>function initialize()",
            name : "initialize"
        }, {
            type : "select",
            title : "数据模型",
            name : "modelName",
            options : mvvm.getModels
        }, {
            type : "select",
            title : "数据集合",
            name : "collectionName",
            options : mvvm.getCollections
        }, {
            type : "select",
            title : "网页视图",
            name : "viewName",
            options : mvvm.getFrames
        }, {
            type : "events-bind",
            title : "视图交互事件",
            name : "events"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "00720618-89e7-4782-b4e5-fbbdce75e066",
        name : "ViewModel",
        tip : "视图模型控件，用于处理数据与视图间的双向绑定，同时处理视图的用户交互逻辑。",
        type : "mvvm",
        icon : "viewmodel.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
