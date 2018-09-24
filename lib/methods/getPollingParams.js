'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var userPromise, sidPromise, kvPromise, user, sid, kv;
    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    // TODO: получаем данные для сессии KV
                    userPromise = _axios2.default.get('/api/user', this.settings.axios), sidPromise = _axios2.default.get('/api/server/sid', this.settings.axios), kvPromise = _axios2.default.get('/api/server/kv', this.settings.axios);
                    _context.next = 3;
                    return userPromise;

                case 3:
                    user = _context.sent;
                    _context.next = 6;
                    return sidPromise;

                case 6:
                    sid = _context.sent;
                    _context.next = 9;
                    return kvPromise;

                case 9:
                    kv = _context.sent;
                    return _context.abrupt('return', {
                        // TODO: добавить лонгпуллинг для всех доступных карт либо придумать где спрашивать карту
                        kv_server: kv.data.host,
                        kv_session: user.data.kv_session,
                        sid: sid.data,
                        lastevent: '',
                        version: 0
                    });

                case 11:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, this);
}));