'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventGraphQLType = undefined;
exports.getEventResolvers = getEventResolvers;

var _graphqlComposeJson = require('graphql-compose-json');

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

var _Location = require('./Location');

var _Location2 = _interopRequireDefault(_Location);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restApiResponse = {
  id: 48,
  status: "publish",
  title: {
    rendered: "Craft Carnival"
  },
  acf: {
    event_url: "http://localhost:8080/wp-content/uploads/2018/07/Craft-Carnival-2018-ad1.jpg",
    event_description: "event description",
    event_start_day: "06/16/2018",
    event_start_time: "2:00 pm",
    event_end_day: "06/16/2018",
    event_end_time: "8:00 pm",
    event_background: "http://localhost:8080/wp-content/uploads/2018/07/Craft-Carnival-2018-ad1.jpg",
    event_page_hero: "http://localhost:8080/wp-content/uploads/2018/07/Craft-Carnival-2018-ad1.jpg",
    event_type: "event type",
    locations: [103]
  }

};

var EventTC = (0, _graphqlComposeJson2.default)('Event', restApiResponse);

var EventGraphQLType = exports.EventGraphQLType = EventTC.getType();

(0, _utils.createFindByIdResolver)(EventTC, 'events');
(0, _utils.createFindByUrlListResolver)(EventTC);
(0, _utils.createFindAllResolver)(EventTC, 'events');
(0, _utils.createFindByIdListResolver)(EventTC, 'events');

EventTC.addRelation('locations', {
  resolver: function resolver() {
    return _Location2.default.getResolver('findByIdList');
  },
  prepareArgs: {
    ids: function ids(source) {
      return source.acf.locations;
    }
  }
});

function getEventResolvers() {
  return {
    allEvents: EventTC.getResolver('findAll'),
    eventById: EventTC.getResolver('findById')
  };
}

exports.default = EventTC;