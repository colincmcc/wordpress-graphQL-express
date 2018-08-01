'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _Page = require('./types/Page');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// BaseUrl is also used in ./utils
// ! This schema expects relative URL's to be returned
var baseUrl = _config.prod.wpEndpoint;
var digitalPourUrl = 'https://server.digitalpour.com/DashboardServer/api/v3/MenuItems/54640e97b3b6f60d0887afaa';
var digitalPourKey = '54948fb0b3b6f60a54b37b16';

var cocktailResolvers = (0, _Cocktail.getCocktailResolvers)();
var foodResolvers = (0, _Food.getFoodResolvers)();
var headerResolvers = (0, _Header.getHeaderResolvers)();
var locationResolvers = (0, _Location.getLocationResolvers)();
var reviewResolvers = (0, _Review.getReviewResolvers)();
var canResolvers = (0, _Can.getCanResolvers)();
var eventResolvers = (0, _Event.getEventResolvers)();
var premiumResolvers = (0, _Premium.getPremiumResolvers)();

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