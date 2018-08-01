'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.createFindByIdResolver = createFindByIdResolver;
exports.createFindByUrlListResolver = createFindByUrlListResolver;
exports.createFindByIdListResolver = createFindByIdListResolver;
exports.createFindAllResolver = createFindAllResolver;
exports.createFindByMetaResolver = createFindByMetaResolver;

var _graphqlCompose = require('graphql-compose');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseUrl = _config.prod.wpEndpoint;

// * Find one by ID
function createFindByIdResolver(tc, urlAddr) {
  var _this = this;

  tc.addResolver({
    name: 'findById',
    type: tc,
    args: {
      id: 'Int!'
    },
    resolve: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(rp) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', rp.context.loader.load(baseUrl + '/' + urlAddr + '/' + rp.args.id + '/'));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      function resolve(_x) {
        return _ref.apply(this, arguments);
      }

      return resolve;
    }()
  });
}

// * Resolve a list of urls
function createFindByUrlListResolver(tc) {
  tc.addResolver({
    name: 'findByUrlList',
    type: [tc],
    resolve: function resolve(rp) {
      return rp.context.loader.loadMany(rp.args.urls);
    }
  });
}

// * Resolve a list of IDs
function createFindByIdListResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findByIdList',
    type: [tc],
    resolve: function resolve(rp) {
      var urlList = rp.args.ids.map(function (id) {
        return [baseUrl + '/' + urlAddr + '/' + id];
      });
      return rp.context.loader.loadMany(urlList);
    }
  });
}

// * Find all of a post type
function createFindAllResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findAll',
    type: [tc],
    resolve: function resolve(rp) {
      return rp.context.loader.load(baseUrl + '/' + urlAddr + '/');
    }
  });
}

// * Find all of a post type with a given meta value
function createFindByMetaResolver(tc, urlAddr, metaType) {
  tc.addResolver({
    name: 'findByMeta',
    type: [tc],
    args: (0, _defineProperty3.default)({}, metaType, 'String!'),
    resolve: function resolve(rp) {
      return rp.context.loader.load(baseUrl + '/' + urlAddr + '?' + metaType + '=' + rp.args[[metaType]]);
    }
  });
}