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
exports.createFindAllCbResolver = createFindAllCbResolver;
exports.createFindCbByIdResolver = createFindCbByIdResolver;
exports.createCreateCbResolver = createCreateCbResolver;
exports.createSubEventUpdatedResolver = createSubEventUpdatedResolver;

var _graphqlCompose = require('graphql-compose');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('./config');

var _subscriptions = require('./subscriptions');

var _apolloServer = require('apollo-server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();

// ! TypeComposer can not add subscriptions to type yet

var baseUrl = _config.prod.wpEndpoint;
var coinbaseEndpoint = _config.prod.coinbaseCommerceUrl;
var coinbaseKey = process.env.COINBASE_KEY;
var coinbaseSecret = process.env.COINBASE_SECRET;
var coinbaseApiVersion = process.env.COINBASE_API_VER;

/**
 * * WORDPRESS RESOLVER FUNCTIONS
 */
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
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref) {
        var args = _ref.args,
            context = _ref.context;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', context.loader.load(baseUrl + '/' + urlAddr + '/' + args.id + '/'));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      function resolve(_x) {
        return _ref2.apply(this, arguments);
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
    resolve: function resolve(_ref3) {
      var context = _ref3.context;

      return context.loader.loadMany(rp.args.urls);
    }
  });
}

// * Resolve a list of IDs
function createFindByIdListResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findByIdList',
    type: [tc],
    resolve: function resolve(_ref4) {
      var args = _ref4.args,
          context = _ref4.context;

      var urlList = args.ids.map(function (id) {
        return [baseUrl + '/' + urlAddr + '/' + id];
      });
      return context.loader.loadMany(urlList);
    }
  });
}

// * Find all of a post type
function createFindAllResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findAll',
    type: [tc],
    resolve: function resolve(_ref5) {
      var context = _ref5.context;

      return context.loader.load(baseUrl + '/' + urlAddr + '/');
    }
  });
}

// * Find all of a post type with a given meta value
function createFindByMetaResolver(tc, urlAddr, metaType) {
  tc.addResolver({
    name: 'findByMeta',
    type: [tc],
    args: (0, _defineProperty3.default)({}, metaType, 'String!'),
    resolve: function resolve(_ref6) {
      var args = _ref6.args,
          context = _ref6.context;

      return context.loader.load(baseUrl + '/' + urlAddr + '?' + metaType + '=' + args[[metaType]]);
    }
  });
}

/**
 * *COINBASE RESOLVER FUNCTIONS
 */
var coinbaseInstance = _axios2.default.create({
  baseURL: coinbaseEndpoint,
  timeout: 5000,
  headers: {
    'X-CC-Api-Key': '' + coinbaseKey,
    'X-CC-Version': '' + coinbaseApiVersion,
    'Content-Type': 'application/json'
  }
});

// * Find all Coinbase events
function createFindAllCbResolver(tc, urlAddr) {
  var _this2 = this;

  tc.addResolver({
    name: 'findAllCb',
    type: [tc],
    args: {},
    resolve: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref7) {
        var context = _ref7.context;
        var responseData;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                responseData = coinbaseInstance.get('/' + urlAddr).then(function (response) {
                  return response.data.data;
                }).catch(function (error) {
                  // handle error
                  console.log(error);
                });
                _context2.next = 3;
                return responseData;

              case 3:
                return _context2.abrupt('return', _context2.sent);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      function resolve(_x2) {
        return _ref8.apply(this, arguments);
      }

      return resolve;
    }()
  });
}

// * Find a Coinbase event based on id
function createFindCbByIdResolver(tc, urlAddr) {
  var _this3 = this;

  tc.addResolver({
    name: 'findCbById',
    type: tc,
    args: {
      id: 'String!'
    },
    resolve: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref9) {
        var args = _ref9.args,
            context = _ref9.context;
        var responseData;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                responseData = coinbaseInstance.get('/' + urlAddr + '/' + args.id).then(function (response) {
                  return response.data.data;
                }).catch(function (error) {
                  // handle error
                  console.log(error);
                });
                _context3.next = 3;
                return responseData;

              case 3:
                return _context3.abrupt('return', _context3.sent);

              case 4:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this3);
      }));

      function resolve(_x3) {
        return _ref10.apply(this, arguments);
      }

      return resolve;
    }()
  });
}

// * Create Coinbase event
function createCreateCbResolver(tc, urlAddr) {
  var _this4 = this;

  tc.addResolver({
    name: 'createCb',
    type: tc,
    args: {
      name: 'String',
      description: 'String',
      amount: 'String',
      pricingType: 'String',
      custId: 'String',
      custName: 'String'
    },
    resolve: function () {
      var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(_ref11) {
        var args = _ref11.args,
            context = _ref11.context;
        var data, responseData;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                data = {
                  name: args.name,
                  description: args.description,
                  local_price: {
                    amount: args.amount,
                    currency: 'USD'
                  },
                  pricing_type: args.pricingType,
                  metadata: {
                    customer_id: args.custId,
                    customer_name: args.custName
                  }
                };
                responseData = coinbaseInstance.post('/' + urlAddr, data).then(function (response) {
                  return response.data.data;
                }).catch(function (error) {
                  // handle error
                  console.log(error);
                });
                _context4.next = 4;
                return responseData;

              case 4:
                return _context4.abrupt('return', _context4.sent);

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this4);
      }));

      function resolve(_x4) {
        return _ref12.apply(this, arguments);
      }

      return resolve;
    }()
  });
}

// * Coinbase webhook subscriptions
function createSubEventUpdatedResolver(tc) {
  tc.addResolver({
    kind: 'subscription',
    name: "subEventUpdated",
    type: tc,
    resolve: function resolve(payload) {
      return payload.chargeUpdated;
    },
    subscribe: function subscribe() {
      return _subscriptions.pubsub.asyncIterator("CHARGE_UPDATED");
    }
  });
}