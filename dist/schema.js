'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _graphqlCompose = require('graphql-compose');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _subscriptions = require('./subscriptions');

var _Food = require('./types/Wordpress/Food');

var _Header = require('./types/Wordpress/Header');

var _TapList = require('./types/Wordpress/TapList');

var _Cocktail = require('./types/Wordpress/Cocktail');

var _Location = require('./types/Wordpress/Location');

var _Review = require('./types/Wordpress/Review');

var _Can = require('./types/Wordpress/Can');

var _Event = require('./types/Wordpress/Event');

var _Premium = require('./types/Wordpress/Premium');

var _ContactForm = require('./types/ContactForm');

var _Page = require('./types/Wordpress/Page');

var _CoinbaseCharge = require('./types/Coinbase/CoinbaseCharge');

var _CoinbaseEventHook = require('./types/Coinbase/CoinbaseEventHook');

var _CoinbaseEventHook2 = _interopRequireDefault(_CoinbaseEventHook);

var _config = require('./config');

var _mailgun = require('mailgun.js');

var _mailgun2 = _interopRequireDefault(_mailgun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

// ! Wordpress schema expects relative URL's to be returned

// BaseUrl is also used in ./utils
var baseUrl = _config.prod.wpEndpoint;
var digitalPourUrl = 'https://server.digitalpour.com/DashboardServer/api/v3/MenuItems/54640e97b3b6f60d0887afaa';
var digitalPourKey = process.env.DIGITAL_POUR_KEY;
var mailgunUrl = process.env.MAILGUN_URL;
var mailgunKey = process.env.MAILGUN_KEY;

// * Wordpress
var cocktailResolvers = (0, _Cocktail.getCocktailResolvers)();
var foodResolvers = (0, _Food.getFoodResolvers)();
var headerResolvers = (0, _Header.getHeaderResolvers)();
var locationResolvers = (0, _Location.getLocationResolvers)();
var reviewResolvers = (0, _Review.getReviewResolvers)();
var canResolvers = (0, _Can.getCanResolvers)();
var eventResolvers = (0, _Event.getEventResolvers)();
var premiumResolvers = (0, _Premium.getPremiumResolvers)();

// * COINBASE
// -Queries
var coinbaseChargeResolvers = (0, _CoinbaseCharge.getCoinbaseChargeResolvers)();
// -Mutations
var coinbaseChargeMutations = (0, _CoinbaseCharge.getCoinbaseChargeMutations)();
// Subscriptions
var coinbaseEventHookSubscriptions = (0, _CoinbaseEventHook.getCoinbaseEventHookSubscriptions)();

var mgClient = _mailgun2.default.client({
  username: 'api',
  key: mailgunKey || ''
});

_graphqlCompose.GQC.rootMutation().addFields((0, _extends3.default)({}, coinbaseChargeMutations, {
  mailFormData: {
    type: "ContactForm",
    args: {
      to: ["String!"],
      from: "String!",
      subject: "String!",
      formData: "String!"
    },
    resolve: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_, args) {
        var mgResponse;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                mgResponse = {};

                mgClient.messages.create("iph.colinmac.me", {
                  from: args.from,
                  to: args.to,
                  subject: args.subject,
                  text: args.formData
                }).then(function (msg) {
                  return console.log(msg);
                }).catch(function (err) {
                  return console.log(err);
                });

                return _context.abrupt('return', mgResponse);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      function resolve(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return resolve;
    }()
  }
}));
_graphqlCompose.GQC.rootQuery().addFields((0, _extends3.default)({}, cocktailResolvers, foodResolvers, headerResolvers, locationResolvers, reviewResolvers, canResolvers, eventResolvers, premiumResolvers, coinbaseChargeResolvers, {
  pageBy: {
    type: [_Page.PageTC],
    args: {
      id: 'Int',
      slug: 'String'
    },
    resolve: function resolve(_, args) {
      if (args.id != null) {
        return (0, _nodeFetch2.default)(baseUrl + '/pages/' + args.id).then(function (r) {
          return [r.json()];
        });
      }
      if (args.slug != null) {
        return (0, _nodeFetch2.default)(baseUrl + '/pages?slug=' + args.slug).then(function (r) {
          return r.json();
        });
      }
    }
  },
  allPages: {
    type: [_Page.PageTC],
    resolve: function resolve() {
      return (0, _nodeFetch2.default)(baseUrl + '/pages/').then(function (r) {
        return r.json();
      });
    }
  },
  allTaps: {
    type: [_TapList.TapListTC],
    args: {
      location: 'Int!'
    },
    resolve: function resolve(_, args) {
      return (0, _nodeFetch2.default)(digitalPourUrl + '/' + args.location + '/Tap?apiKey=' + digitalPourKey).then(function (r) {
        return r.json();
      });
    }
  }
}));

_graphqlCompose.GQC.rootSubscription().addFields((0, _extends3.default)({}, coinbaseEventHookSubscriptions));

var schema = _graphqlCompose.GQC.buildSchema(); // returns GraphQLSchema

exports.default = schema;