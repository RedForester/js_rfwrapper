"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var _this = this;

    var idx = this.middlewares.length;

    for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
        middlewares[_key] = arguments[_key];
    }

    middlewares.forEach(function (_fn) {
        _this.middlewares.push({
            fn: function fn(ctx) {
                return _fn(ctx, function () {
                    return _this.next(ctx, idx);
                });
            }
        });
    });

    return this;
};