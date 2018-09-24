'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _use = require('./use');

var _use2 = _interopRequireDefault(_use);

var _next = require('./next');

var _next2 = _interopRequireDefault(_next);

var _startPolling = require('./startPolling');

var _startPolling2 = _interopRequireDefault(_startPolling);

var _getPollingParams = require('./getPollingParams');

var _getPollingParams2 = _interopRequireDefault(_getPollingParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    event: _event2.default,
    use: _use2.default,
    next: _next2.default,
    getPollingParams: _getPollingParams2.default,
    startPolling: _startPolling2.default
};