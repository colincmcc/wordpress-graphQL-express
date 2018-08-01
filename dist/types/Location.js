'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocationGraphQLType = undefined;
exports.getLocationResolvers = getLocationResolvers;

var _graphqlComposeJson = require('graphql-compose-json');

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restApiResponse = {
  id: 48,
  title: {
    rendered: "Lawrenceville"
  },
  acf: {
    loc_symbol: "LV",
    loc_num: "1",
    address: {
      address: "4305 Butler St, Pittsburgh, PA 15201, USA",
      lat: "40.4709302",
      lng: "-79.96044130000001"
    },
    open_hours: "text",
    happy_hour: "text",
    phone_number: "412-683-1100",
    email: "reservations@industrypgh.com",
    number_of_taps: "43",
    loc_description: "",
    facebook: "https://www.facebook.com/industrypublichouse",
    twitter: "https://twitter.com/industrypgh",
    instagram: "https://www.instagram.com/industrypublichouse/",
    trip_advisor: "https://www.tripadvisor.com/Restaurant_Review-g53449-d10035864-Reviews-Industry_Public_House-Pittsburgh_Pennsylvania.html"

  }
};
var LocationTC = (0, _graphqlComposeJson2.default)('Location', restApiResponse);

(0, _utils.createFindByIdResolver)(LocationTC, 'location');
(0, _utils.createFindByUrlListResolver)(LocationTC);
(0, _utils.createFindAllResolver)(LocationTC, 'location');
(0, _utils.createFindByIdListResolver)(LocationTC, 'location');

var LocationGraphQLType = exports.LocationGraphQLType = LocationTC.getType();

LocationTC.addRelation('cans', {
  resolver: function resolver() {
    return LocationTC.getResolver('findByIdList');
  },
  prepareArgs: {
    ids: function ids(source) {
      return source.acf.locations;
    }
  }
});

function getLocationResolvers() {

  return {
    locationById: LocationTC.getResolver('findById'),
    allLocations: LocationTC.getResolver('findAll')
  };
}
exports.default = LocationTC;