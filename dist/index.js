'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var loadData = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url) {
    var res, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _nodeFetch2.default)(url);

          case 2:
            res = _context.sent;
            _context.next = 5;
            return res.json();

          case 5:
            data = _context.sent;

            if (!(data && data.count && data.results)) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', data.results);

          case 8:
            return _context.abrupt('return', data);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function loadData(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 4000;
var graphQlServer = (0, _express2.default)();

graphQlServer.options('*', (0, _cors2.default)());
graphQlServer.use((0, _cors2.default)());

graphQlServer.use('/', (0, _expressGraphql2.default)(function () {
  var loader = new _dataloader2.default(function (keys) {
    return _promise2.default.all(keys.map(loadData));
  });

  return {
    schema: _schema2.default,
    graphiql: true,
    context: {
      loader: loader
    }
  };
}));

// * CONSOLE LOG
graphQlServer.listen(port, function () {
  console.log('GraphQL Server (with cors) running on port ' + port);
  console.log('Visit http://localhost:' + port);
});