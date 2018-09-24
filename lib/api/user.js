'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = undefined;

var get = exports.get = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var userid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'self';

        var _res, res;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(userid === 'self')) {
                            _context.next = 5;
                            break;
                        }

                        _context.next = 3;
                        return (0, _axios2.default)('/api/user', this.settings.axios);

                    case 3:
                        _res = _context.sent;
                        return _context.abrupt('return', _res.data);

                    case 5:
                        _context.next = 7;
                        return (0, _axios2.default)('/api/user/' + userid, this.settings.axios);

                    case 7:
                        res = _context.sent;
                        return _context.abrupt('return', res.data);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function get() {
        return _ref.apply(this, arguments);
    };
}();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable func-style */