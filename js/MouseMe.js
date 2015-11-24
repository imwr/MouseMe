/**
 * @author wr
 * @email mvpjly@163.com
 * @date 2014/10/19
 */
;
(function ($) {
    "use strict";
    var MouseMe = function (element, options) {
        this.ele = element;
        this.options = options;
        return "undefined" != typeof this.init && this.init.apply(this, arguments)
    };
    MouseMe.prototype = {
        init: function () {
            this.target = $(this.ele);
            this.touch = ("ontouchend" in document);
            this.options.onHold && (this._addMouseDownEvent() || this._addMouseUpEvent());
            this.options.onMultiClick && this._addClickEvent();
        },
        _addMouseUpEvent: function () {
            var _this = this;
            _this.target.on(!this.touch ? "mouseup mouseout" : "touchend", function () {
                clearTimeout(_this.powerInterval);
            });
        },
        _addMouseDownEvent: function () {
            var _this = this;
            this.target.on(!this.touch ? "mousedown" : "touchstart", function () {
                _this.powerInterval = setTimeout(function () {
                    _this.options.onHold && _this.options.onHold(_this.ele);
                }, _this.options.holdTime);
            })
        },
        _addClickEvent: function () {
            var _this = this, times = 0, clickout = null;
            this.target.on(this.touch ? "touchstart" : "click", function () {
                times = (times + 1) % _this.options.multiNum;
                clickout && clearTimeout(clickout);
                if (times == 0) {
                    _this.options.onMultiClick && _this.options.onMultiClick(this);
                } else {
                    clickout = setTimeout(function () {
                        times = 0;
                    }, _this.options.multiInterval)
                }
            })
        }
    };
    var defaults = {
        holdTime: 1000,//鼠标长按触发事件的时间
        onHold: null, //鼠标长按指定时间事件
        multiNum: 3,//监听鼠标多次点击的次数
        multiInterval: 500,//监听鼠标点击次数时间段
        onMultiClick: null//鼠标达到点击次数的触发事件
    };
    $.fn.mouseMe = function (method) {
        return this.each(function () {
            var opts = $.extend({}, defaults, typeof method == 'object' && method);
            var ui = new MouseMe(this, opts);
            $._data(this, "MouseMe", ui);
        });
    };
})(jQuery);

