'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanGraphQLType = undefined;
exports.getCanResolvers = getCanResolvers;

var _graphqlComposeJson = require('graphql-compose-json');

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

var _Location = require('./Location');

var _Location2 = _interopRequireDefault(_Location);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restApiResponse = {
  id: 48,
  acf: {
    locations: [104, 103],
    price: "13",
    name: "Breakfast 1",
    description: "blah / blah / blah"
  }

};

var CanTC = (0, _graphqlComposeJson2.default)('Can', restApiResponse);

var CanGraphQLType = exports.CanGraphQLType = CanTC.getType();

(0, _utils.createFindByIdResolver)(CanTC, 'cans');
(0, _utils.createFindByUrlListResolver)(CanTC);
(0, _utils.createFindAllResolver)(CanTC, 'cans');
(0, _utils.createFindByIdListResolver)(CanTC, 'cans');

CanTC.addRelation('locations', {
  resolver: function resolver() {
    return _Location2.default.getResolver('findByIdList');
  },
  prepareArgs: {
    ids: function ids(source) {
      return source.acf.locations;
    }
  }
});

function getCanResolvers() {
  return {
    allCans: CanTC.getResolver('findAll'),
    canById: CanTC.getResolver('findById')
  };
}

exports.default = CanTC;