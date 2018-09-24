"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (trigger) {
    var _this = this;

    var idx = this.middlewares.length;

    for (var _len = arguments.length, middlewares = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        middlewares[_key - 1] = arguments[_key];
    }

    middlewares.forEach(function (_fn) {
        _this.middlewares.push({
            fn: function fn(ctx) {
                return _fn(ctx, function () {
                    return _this.next(ctx, idx);
                });
            },
            trigger: trigger
        });
    });

    return this;
};