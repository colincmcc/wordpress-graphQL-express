'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContactFormTC = undefined;

var _graphqlCompose = require('graphql-compose');

var ContactFormTC = exports.ContactFormTC = _graphqlCompose.TypeComposer.create({
  name: 'ContactForm',
  fields: {
    to: ['String!'],
    from: 'String!',
    subject: 'String!',
    html: 'String!',
    status: 'String'
  }
});