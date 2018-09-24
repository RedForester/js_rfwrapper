"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (ctx) {
    var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

    if (this.middlewares.length > idx + 1) {
        var _middlewares = this.middlewares[idx + 1],
            fn = _middlewares.fn,
            trigger = _middlewares.trigger;


        if (trigger === ctx.type) {
            return fn(ctx);
        } else if (!trigger) {
            return fn(ctx);
        }

        return this.next(ctx, idx + 1);
    }
};