'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WineGraphQLType = undefined;
exports.getCocktailResolvers = getCocktailResolvers;

var _graphqlComposeJson = require('graphql-compose-json');

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restApiResponse = {
  id: 48,
  acf: {
    price: "13",
    name: "Breakfast 1",
    description: "blah / blah / blah"
  }
};

var WineTC = (0, _graphqlComposeJson2.default)('Wine', restApiResponse);
var WineGraphQLType = exports.WineGraphQLType = WineTC.getType();

(0, _utils.createFindByIdResolver)(WineTC, 'wines');
(0, _utils.createFindByUrlListResolver)(WineTC);
(0, _utils.createFindAllResolver)(WineTC, 'wines');

function getCocktailResolvers() {
  return {
    allWines: WineTC.getResolver('findAll'),
    winesById: WineTC.getResolver('findById')
  };
}

exports.default = WineTC;