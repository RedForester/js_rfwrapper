'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _context2 = require('../context');

var _context3 = _interopRequireDefault(_context2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(mapid) {
        var _this = this;

        var _ref2, kv_server, kv_session, sid, lastevent, version, kvurl, _ref3, newevent, _ref4, events;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return this.getPollingParams(mapid);

                    case 2:
                        _ref2 = _context.sent;
                        kv_server = _ref2.kv_server;
                        kv_session = _ref2.kv_session;
                        sid = _ref2.sid;
                        lastevent = _ref2.lastevent;
                        version = _ref2.version;
                        kvurl = 'http://' + kv_server + ':12000/v2/kv';

                    case 9:
                        if (!true) {
                            _context.next = 34;
                            break;
                        }

                        _context.prev = 10;
                        _context.next = 13;
                        return (0, _axios2.default)(kvurl + '/keys/RF:' + sid + ':mapNotifLast:' + mapid + ':' + kv_session + ('?n=3&r=2&w=2&waitTimeout=1&waitVersion=' + version), this.settings.axios);

                    case 13:
                        _ref3 = _context.sent;
                        newevent = _ref3.data;

                        if (!(lastevent === '')) {
                            _context.next = 20;
                            break;
                        }

                        lastevent = newevent.value;
                        version = newevent.version;
                        _context.next = 27;
                        break;

                    case 20:
                        _context.next = 22;
                        return (0, _axios2.default)(kvurl + '/partition/RF:' + sid + ':mapNotif:' + mapid + ':' + kv_session + ('?to=' + newevent.value + '&from=' + lastevent) + 'n=3&r=2&w=2', this.settings.axios);

                    case 22:
                        _ref4 = _context.sent;
                        events = _ref4.data;

                        version = newevent.version;
                        lastevent = newevent.value;

                        events.forEach(function (event) {
                            _this.next(new _context3.default(event.value));
                        });

                    case 27:
                        _context.next = 32;
                        break;

                    case 29:
                        _context.prev = 29;
                        _context.t0 = _context['catch'](10);

                        if (_context.t0.response) {
                            if (_context.t0.response.status !== 408) {
                                // ошибка 408 -> переподключение
                                console.error('longpolling: ' + _context.t0.response.statusText);
                            }
                        } else {
                            console.error(_context.t0);
                        }

                    case 32:
                        _context.next = 9;
                        break;

                    case 34:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[10, 29]]);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();