'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PremiumGraphQLType = undefined;
exports.getPremiumResolvers = getPremiumResolvers;

var _graphqlComposeJson = require('graphql-compose-json');

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

var _Location = require('./Location');

var _Location2 = _interopRequireDefault(_Location);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restApiResponse = {
  id: 48,
  acf: {
    tasting_notes: "See a hazy, copper color. Taste a rich, supple entry, leading to a decadent, huge, full-bodied palate with intense caramel, toffee and peppery brown spice flavors. Then, enjoy a finish with an extreme, long, complex, evolving fade of spice and wood notes. Experts deem it a seductive, exotic and virtually flawless bourbon.",
    proof: "107",
    aged: "15",
    background_picture: "http://localhost:8080/wp-content/uploads/2018/07/15_year.jpg",
    distillery: "Pappy Van Winkle",
    product_name: "Family Reserve 15yr",
    locations: [104, 103]
  }

};

var PremiumTC = (0, _graphqlComposeJson2.default)('Premium', restApiResponse);

var PremiumGraphQLType = exports.PremiumGraphQLType = PremiumTC.getType();

(0, _utils.createFindByIdResolver)(PremiumTC, 'premium');
(0, _utils.createFindByUrlListResolver)(PremiumTC);
(0, _utils.createFindAllResolver)(PremiumTC, 'premium');
(0, _utils.createFindByIdListResolver)(PremiumTC, 'premium');

PremiumTC.addRelation('locations', {
  resolver: function resolver() {
    return _Location2.default.getResolver('findByIdList');
  },
  prepareArgs: {
    ids: function ids(source) {
      return source.acf.locations;
    }
  }
});

function getPremiumResolvers() {
  return {
    allPremium: PremiumTC.getResolver('findAll'),
    premiumById: PremiumTC.getResolver('findById')
  };
}

exports.default = PremiumTC;