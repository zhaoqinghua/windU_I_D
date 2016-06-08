jQuery(function($) {
    var Template = loadTemplate("../assets/designer/controls/template/control/multilistview.html");
    var jsTemplate = loadTemplate("../assets/designer/controls/template/control/multilistview.js");
    var View = Backbone.Designer.View.extend({//options...
        initialize : function(option) {
            this.render();
            this.listenTo(this.model, "change", function() {
                this.update();
            })
            this.listenTo(this.model, "change:listdata", function() {
                var data = JSON.parse(JSONProcess(this.model.get("listdata")));
                var f = PathModule.dirname($.getUrlParam("path"));
                for (var i in data) {
                    if (data[i].icon.indexOf("http") != 0 && data[i].icon.indexOf("file://") != 0)
                        data[i].icon = (("file:///" + f + "\\" + data[i].icon).replace(/\\/g, "/"));
                }
                this.$lv.set(data);
            })
            Backbone.Designer.View.prototype.initialize.apply(this, arguments);
        },
        template : Template, //VIEW对应的模板
        jsTemplate : jsTemplate, //VIEW对应的JS模板
        render : function() {
            var self = this;
            if (this.template) {
                this.$el = $(this.template(this.model.attributes));
                Backbone.Designer.View.prototype.render.apply(this, arguments);
                this.update();
            }
            return this;
        },
        update : function() {
            var extOptions = this.model.toJSON();
            var $listview = $(this.$el);
            try {
                if (this.$lv) {
                    this.$lv.ele.empty();
                    delete this.$lv;
                }
                this.$lv = appcan.listview({
                    selector : $listview,
                    type : "thickLine",
                    hasAngle : extOptions.hasAngle || false,
                    hasIcon : extOptions.hasIcon || false,
                    align : extOptions.align || "left",
                    hasRadiobox : extOptions.hasRadiobox || false,
                    hasCheckbox : extOptions.hasCheckbox || false,
                    hasSubTitle : extOptions.hasSubTitle || false,
                    multiLine : extOptions.multiLine || 1,
                });
                var data = JSON.parse(JSONProcess(this.model.get("listdata")));
                var f = PathModule.dirname($.getUrlParam("path"));
                for (var i in data) {
                    if (data[i].icon.indexOf("http") != 0 && data[i].icon.indexOf("file://") != 0)
                        data[i].icon = (("file:///" + f + "\\" + data[i].icon).replace(/\\/g, "/"));
                }
                this.$lv.set(data);
            } catch(e) {

            }
        },
        appendChild : function(el) {
            $(this.$el).append(el);
        }
    });

    var Config = Backbone.Designer.Config.extend({
        initialize : function() {
            this.set("type", "MultiListView");
            Backbone.Designer.Config.prototype.initialize.apply(this, arguments);
            this.set("size_h", "70");
            this.set("hasAngle", false);
            this.set("hasIcon", false);
            this.set("hasRadiobox", false);
            this.set("hasCheckbox", false);
            this.set("align", "left");
            this.set("hasSubTitle", false);
            this.set("multiLine", 1);
            this.set("listdata", JSONProcess(JSON.stringify([{
                title : "临时数据",
                describe : "测试",
                note : "测试",
                icon : "css/res/appcan_s.png",
                icontitle : "appcan",
                subTitle : "-195.3",
                subDescribe : "缺货",
                subNote : "北京",
                id : "1"
            }, {
                title : "临时数据",
                describe : "测试",
                note : "测试",
                icon : "css/res/appcan_s.png",
                icontitle : "appcan",
                subTitle : "-195.3",
                subDescribe : "缺货",
                subNote : "北京",
                id : "2"
            }])))
            this.set("dep", "appcan.listview.js");
        },
        extOptions : [{
            type : "checkbox",
            title : "hasAngle",
            name : "hasAngle"
        }, {
            type : "checkbox",
            title : "hasCheckbox",
            name : "hasCheckbox"
        }, {
            type : "checkbox",
            title : "hasRadiobox",
            name : "hasRadiobox"
        }, {
            type : "checkbox",
            title : "hasSubTitle",
            name : "hasSubTitle"
        }, {
            type : "checkbox",
            title : "hasIcon",
            name : "hasIcon"
        }, {
            type : "input",
            title : "multiLine",
            name : "multiLine"
        }, {
            type : "select",
            title : "align",
            name : "align",
            options : [{
                val : "left",
                lab : "left"
            }, {
                val : "right",
                lab : "right"
            }]
        }, {
            type : "textarea",
            title : "List Data",
            name : "listdata"
        }]
    })

    window.desUIControlsListViewInstance.register({
        uuid : "0692f033-5232-4e36-8eba-81ff05727a67",
        name : "MultiListView",
        tip : "标准多行列表控件，不支持用户自定义配置",
        icon : "MListview.png"
    }, {
        View : View,
        Template : Template,
        Config : Config
    })
});
