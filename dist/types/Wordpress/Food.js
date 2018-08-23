'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FoodGraphQLType = undefined;
exports.getFoodResolvers = getFoodResolvers;

var _graphqlComposeJson = require('graphql-compose-json');

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restApiResponse = {
  id: 48,
  acf: {
    price: "13",
    food_type: "brunch",
    name: "Breakfast 1",
    description: "blah / blah / blah"
  }
};

var FoodTC = (0, _graphqlComposeJson2.default)('Food', restApiResponse);

var FoodGraphQLType = exports.FoodGraphQLType = FoodTC.getType();

(0, _utils.createFindByIdResolver)(FoodTC, 'foods');
(0, _utils.createFindByUrlListResolver)(FoodTC);
(0, _utils.createFindAllResolver)(FoodTC, 'foods');
(0, _utils.createFindByMetaResolver)(FoodTC, 'foods', 'food_type');

function getFoodResolvers() {
  return {
    foodById: FoodTC.getResolver('findById'),
    allFoods: FoodTC.getResolver('findAll'),
    foodsByMeta: FoodTC.getResolver('findByMeta')
  };
}

exports.default = FoodTC;