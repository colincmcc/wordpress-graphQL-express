'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CocktailGraphQLType = undefined;
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

var CocktailTC = (0, _graphqlComposeJson2.default)('Cocktail', restApiResponse);
var CocktailGraphQLType = exports.CocktailGraphQLType = CocktailTC.getType();

(0, _utils.createFindByIdResolver)(CocktailTC, 'drinks');
(0, _utils.createFindByUrlListResolver)(CocktailTC);
(0, _utils.createFindAllResolver)(CocktailTC, 'drinks');

function getCocktailResolvers() {
  return {
    allCocktails: CocktailTC.getResolver('findAll'),
    cocktailsById: CocktailTC.getResolver('findById')
  };
}

exports.default = CocktailTC;