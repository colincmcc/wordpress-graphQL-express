'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReviewGraphQLType = undefined;
exports.getReviewResolvers = getReviewResolvers;

var _graphqlComposeJson = require('graphql-compose-json');

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restApiResponse = {

  id: 41,
  status: "publish",
  acf: {
    review_source: "Trip Advisor",
    source_link: "https://www.tripadvisor.com/ShowUserReviews-g53449-d10065653-r578623626-Industry_Public_House-Pittsburgh_Pennsylvania.html#",
    review_snippet: "very expansive CRAFT Beer and ",
    full_review: "Found this spot near our overnight Hotel. Sta",
    review_date: "05/2018",
    review_topic: ["Drink", "NF"],
    review_author: "Name"
  }
};

var ReviewTC = (0, _graphqlComposeJson2.default)('Review', restApiResponse);
var ReviewGraphQLType = exports.ReviewGraphQLType = ReviewTC.getType();

(0, _utils.createFindByIdResolver)(ReviewTC, 'review');
(0, _utils.createFindByUrlListResolver)(ReviewTC);
(0, _utils.createFindAllResolver)(ReviewTC, 'review');
(0, _utils.createFindByIdListResolver)(ReviewTC, 'review');
(0, _utils.createFindByMetaResolver)(ReviewTC, 'review', 'review_source');

function getReviewResolvers() {
  return {
    reviewsById: ReviewTC.getResolver('findById'),
    allReviews: ReviewTC.getResolver('findAll'),
    reviewsByMeta: ReviewTC.getResolver('findByMeta')
  };
}
exports.default = ReviewTC;