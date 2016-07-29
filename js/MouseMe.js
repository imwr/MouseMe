/* =========================================================== *
 * @site http://tt-cc.cc
 * @email ttccmvp@gmail.com
 * Copyright 2016 ttcc
 * Licensed under the Apache License, Version 2.0 (the "License")
 * =========================================================== */
;
(function ($) {
    "use strict";
    var istouch = ("ontouchend" in document);
    $.event.special.multiClick = {
        setup: function (options) {
            var defaults = {
                times: 3,//监听鼠标多次点击的次数
                interval: 500//监听鼠标点击次数时间段
            };
            var opts = $.extend({}, defaults, options);
            var _this = this, times = 0, clickout = null;
            $.event.add(_this, istouch ? "touchstart" : "click", function () {
                times = (times + 1) % opts.times;
                clickout && clearTimeout(clickout);
                if (times == 0) {
                    $.event.trigger('multiClick', null, _this);
                } else {
                    clickout = setTimeout(function () {
                        times = 0;
                    }, opts.interval)
                }
            });
        },
        teardown: function () {
            var elem = this;
            $.event.remove(elem, istouch ? "touchstart" : "click");
        }
    };
    $.event.special.holdTime = {
        setup: function (options) {
            var defaults = {
                times: 1500,
                onBegin: null // 鼠标刚按下时触发的事件，参数（自身dom节点）
            };
            var opts = $.extend({}, defaults, options);
            var _this = this, powerInterval = null;
            $.event.add(_this, !istouch ? "mousedown" : "touchstart", function () {
                _this.holdTime = false;
                if (opts.onBegin && typeof opts.onBegin == "function") {
                    opts.onBegin(_this);
                }
                powerInterval = setTimeout(function () {
                    _this.holdTime = true;
                    $.event.trigger('holdTime', null, _this);
                }, opts.times);
            });
            $.event.add(_this, !istouch ? "mouseup mouseout" : "touchend", function () {
                clearTimeout(powerInterval);
            });
        },
        teardown: function () {
            var elem = this;
            $.event.remove(elem, !istouch ? "mouseup mouseout" : "touchend");
            $.event.remove(elem, !istouch ? "mousedown" : "touchstart");
        }
    };
})(jQuery);
