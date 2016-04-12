jQuery(function($) {
    var desUIEditorView = Backbone.View.extend({
        initialize : function() {
            this.drag();
        },
        el : ".ui_editor_canvas",
        zoom:1,
        events : {
            "mousewheel" : "wheel"
        },
        offset : {
            "x" : 0,
            "y" : 0
        },
        parentOffset:{
            w:0,
            h:0
        },
        wheel : function(e) {
            var self=this;
            self.offset.x = self.offset.x - e.originalEvent.deltaX;
            self.offset.y = self.offset.y - e.originalEvent.deltaY;
            self.calc();
            return false;
        },
        calc : function() {
            var self = this;
            self.offset.x = (self.offset.x > 0 ? 0 : self.offset.x);
            self.offset.y = (self.offset.y > 0 ? 0 : self.offset.y);
            self.offset.x = (self.offset.x < self.parentOffset.w ? self.parentOffset.w : self.offset.x);
            self.offset.y = (self.offset.y < self.parentOffset.h ? self.parentOffset.h : self.offset.y);
            // self.$el.css("-webkit-transform", "translate3d(" + self.offset.x + "px," + self.offset.y + "px,0px)");
            self.$el.css("-webkit-transform", "scale("+this.zoom+") translate3d(" + self.offset.x + "px," + self.offset.y + "px,0px)");
        },
        drag : function() {
            var self = this;
            var _move = false;
            var _x,
                _y;

            var w = this.$el.width();
            var h = this.$el.height();
            self.parentOffset.w = $(this.$el.parent()).width() - w;
            self.parentOffset.h = $(this.$el.parent()).height() - h;
            self.offset.x = self.parentOffset.w / 2;
            self.offset.y = self.parentOffset.h / 2;;
            self.calc(0, 0);

            this.$el.click(function() {
            }).mousedown(function(e) {
                _move = true;
                _x = e.pageX - self.offset.x;
                _y = e.pageY - self.offset.y;
                e.preventDefault();
            });
            $(document).mousemove(function(e) {
                if (_move) {
                    self.offset.x = e.pageX - _x;
                    self.offset.y = e.pageY - _y;
                    self.calc(_x, _y);
                }
            }).mouseup(function() {
                _move = false;
            });
        },
        scale:function(val){
            var self=this;
            this.zoom = val;
            this.$el.css("-webkit-transform", "scale("+this.zoom+") translate3d(" + self.offset.x + "px," + self.offset.y + "px,0px)");
            $(".editor_zoom_val").text(val)
                
        }
    })

    window.desUIEditorViewInstance = new desUIEditorView();
});

