'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _graphqlCompose = require('graphql-compose');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _Food = require('./types/Food');

var _Header = require('./types/Header');

var _TapList = require('./types/TapList');

var _Cocktail = require('./types/Cocktail');

var _Location = require('./types/Location');

var _Review = require('./types/Review');

var _Can = require('./types/Can');

var _Event = require('./types/Event');

var _Premium = require('./types/Premium');

var _ContactForm = require('./types/ContactForm');

var _Page = require('./types/Page');

var _config = require('./config');

var _mailgun = require('mailgun.js');

var _mailgun2 = _interopRequireDefault(_mailgun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

// BaseUrl is also used in ./utils
// ! This schema expects relative URL's to be returned


var baseUrl = _config.prod.wpEndpoint;
var digitalPourUrl = 'https://server.digitalpour.com/DashboardServer/api/v3/MenuItems/54640e97b3b6f60d0887afaa';
var digitalPourKey = process.env.DIGITAL_POUR_KEY;
var mailgunUrl = process.env.MAILGUN_URL;
var mailgunKey = process.env.MAILGUN_KEY;

var cocktailResolvers = (0, _Cocktail.getCocktailResolvers)();
var foodResolvers = (0, _Food.getFoodResolvers)();
var headerResolvers = (0, _Header.getHeaderResolvers)();
var locationResolvers = (0, _Location.getLocationResolvers)();
var reviewResolvers = (0, _Review.getReviewResolvers)();
var canResolvers = (0, _Can.getCanResolvers)();
var eventResolvers = (0, _Event.getEventResolvers)();
var premiumResolvers = (0, _Premium.getPremiumResolvers)();

var mgClient = _mailgun2.default.client({
  username: 'api',
  key: mailgunKey || ''
});

_graphqlCompose.GQC.rootMutation().addFields({
  mailFormData: {
    type: 'ContactForm',
    args: {
      to: ['String!'],
      from: 'String!',
      subject: 'String!',
      formData: 'String!'
    },
    resolve: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_, args) {
        var mgResponse;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                mgResponse = {};

                mgClient.messages.create('iph.colinmac.me', {
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

});
_graphqlCompose.GQC.rootQuery().addFields((0, _extends3.default)({}, cocktailResolvers, foodResolvers, headerResolvers, locationResolvers, reviewResolvers, canResolvers, eventResolvers, premiumResolvers, {
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

var schema = _graphqlCompose.GQC.buildSchema(); // returns GraphQLSchema

exports.default = schema;