"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var dev = exports.dev = {
  graphQLEndpoint: "http://localhost:4000/",
  wpEndpoint: "http://localhost:8081/wp-json/wp/v2",
  websiteHome: "http://localhost:3000"

};

var prod = exports.prod = {
  graphQLEndpoint: "https://iph.colinmac.me/graphql/",
  wpEndpoint: "https://iph.colinmac.me/wp-json/wp/v2",
  websiteHome: "https://iph.colinmac.me"
};