'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _methods = require('./methods');

var _methods2 = _interopRequireDefault(_methods);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rfwrapper = function () {
    function rfwrapper(settings) {
        var _this = this;

        _classCallCheck(this, rfwrapper);

        if (!settings.mail || !settings.password) {
            throw new Error('You must set user email and password hash!');
        }
        // загружаем информацию о пакете
        this.version = _package2.default.version;

        this.middlewares = [];
        this.methods = [];

        this.settings = {
            mapid: '',
            axios: {
                auth: {
                    username: settings.mail,
                    password: settings.password
                },
                baseURL: settings.host || 'http://app.redforester.com/',
                responseType: 'json'
            },
            longpooling: settings.longpooling || null

            // импортируем все методы для работы с модулем
        };Object.entries(_methods2.default).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                method = _ref2[1];

            _this[key] = method.bind(_this);
        });
        Object.entries(_api2.default).forEach(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                key = _ref4[0],
                method = _ref4[1];

            _this[key] = {};
            Object.entries(method).forEach(function (_ref5) {
                var _ref6 = _slicedToArray(_ref5, 2),
                    keym = _ref6[0],
                    func = _ref6[1];

                _this[key][keym] = func.bind(_this);
            });
        });
    }

    /*
     * Подписка на определенные события
     */


    _createClass(rfwrapper, [{
        key: 'event',
        value: function event(trigger) {
            for (var _len = arguments.length, middlewares = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                middlewares[_key - 1] = arguments[_key];
            }

            this.event.apply(this, [trigger].concat(middlewares));
        }

        /*
         * Создает промежуточные обработчики которые выполняются последовательно,
         * функция выполняется при каждом получении нового события RF
         */

    }, {
        key: 'use',
        value: function use() {
            this.use.apply(this, arguments);
        }

        /*
         * Создание LongPolling соединения
         */

    }, {
        key: 'initPolling',
        value: function initPolling(mapid) {
            if (!mapid) {
                throw new Error('You must set mapid!');
            }
            return this.startPolling(mapid);
        }
    }]);

    return rfwrapper;
}();

module.exports = rfwrapper;