/* =========================================================== *
 * @site http:tt-cc.cn
 * @email mvpjly@163.com
 * Copyright 2014 imwr
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
                times: 2000
            };
            var opts = $.extend({}, defaults, options);
            var _this = this, powerInterval = null;
            $.event.add(_this, istouch ? "mouseup mouseout" : "touchend", function () {
                clearTimeout(powerInterval);
            });
            $.event.add(_this, !istouch ? "mousedown" : "touchstart", function () {
                $.event.trigger(!istouch ? "click" : "touchstart", null, _this);
                powerInterval = setTimeout(function () {
                    $.event.trigger('holdTime', null, _this);
                }, opts.time);
            })
        },
        teardown: function () {
            var elem = this;
            $.event.remove(elem, !istouch ? "mouseup mouseout" : "touchend");
            $.event.remove(elem, !istouch ? "mousedown" : "touchstart");
        }
    };
})(jQuery);
