'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HeaderGraphQLType = undefined;
exports.getHeaderResolvers = getHeaderResolvers;

var _graphqlComposeJson = require('graphql-compose-json');

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restApiResponse = {

    id: 41,
    slug: "view-menu",
    status: "publish",
    type: "header",
    link: "http://localhost:8080/header/view-menu/",
    title: {
        rendered: "View Menu"
    },
    content: {
        rendered: "Content"
    },

    acf: {
        background_image: "http://localhost:8080/wp-content/uploads/2018/06/burgher.jpg",
        hero_image: "heroimg",
        isFeatured: "true",
        headerLink: "custom",
        customLink: "http://CraftCarnivalPGH.com",
        subHeading: "info less than 120 characters",
        buttonText: "View More"
    }
};

var HeaderTC = (0, _graphqlComposeJson2.default)('Header', restApiResponse);
var HeaderGraphQLType = exports.HeaderGraphQLType = HeaderTC.getType();

(0, _utils.createFindByIdResolver)(HeaderTC, 'headers');
(0, _utils.createFindByUrlListResolver)(HeaderTC);
(0, _utils.createFindAllResolver)(HeaderTC, 'headers');
(0, _utils.createFindByIdListResolver)(HeaderTC, 'headers');

function getHeaderResolvers() {
    return {
        headerById: HeaderTC.getResolver('findById'),
        allHeaders: HeaderTC.getResolver('findAll')
    };
}

exports.default = HeaderTC;