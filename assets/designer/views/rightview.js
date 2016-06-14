jQuery(function($) {
    var desUIRightView = Backbone.View.extend({
        initialize : function() {
            this.resize();
        },
        el : '#designRightView',
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
                if (zx) {
                    _move = true;
                    _x = e.pageX;
                    _y = e.pageY;
                    e.stopPropagation();
                    this._resizing = true;
                }
            });
            $(document).mousemove(function(e) {
                if (_move) {
                    var dx = e.pageX - _x;
                    var dy = e.pageY - _y;
                    {
                        var w = Math.max(220,self.$el.width() - zx * dx);
                        self.$el.width(w);
                    }
                    console.log(w);
                    _x = e.pageX;
                    _y = e.pageY;
                } else {
                    var offset = self.$el.offset();
                    var w = self.$el.width();
                    var h = self.$el.height();
                    offset.right = offset.left + w;
                    offset.bottom = offset.top + h;
                    if (e.pageX >= offset.left && e.pageX <= offset.left + 10) {
                        self.$el.css('cursor', 'w-resize');
                        zx = 1;
                        zy = 0;
                        lx = 1;
                        ly = 0;
                    } else {
                        self.$el.css('cursor', 'default');
                        zx = 0;
                        zy = 0;
                        lx = 0;
                        ly = 0;
                    }
                }
            }).mouseup(function() {
                self.$el.css('cursor', 'default');
                _move = false;
                this._resizing = false;
            });
        }
    });
    window.desUIRightViewInstance = new desUIRightView();
});

