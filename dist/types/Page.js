"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PageGraphQLType = exports.PageTC = undefined;

var _graphqlComposeJson = require("graphql-compose-json");

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

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
        hero_image: "heroimg"
    }
};

var PageTC = exports.PageTC = (0, _graphqlComposeJson2.default)('Page', restApiResponse);
var PageGraphQLType = exports.PageGraphQLType = PageTC.getType();