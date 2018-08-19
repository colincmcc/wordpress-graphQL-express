import { GQC } from 'graphql-compose';
import fetch from 'node-fetch';
import axios from 'axios'
import {getFoodResolvers} from './types/Food'
import { getHeaderResolvers, HeaderTC } from './types/Header'
import { TapListTC } from './types/TapList'
import { getCocktailResolvers } from './types/Cocktail'
import { getLocationResolvers } from './types/Location'
import { getReviewResolvers } from './types/Review'
import { getCanResolvers } from './types/Can'
import { getEventResolvers } from './types/Event'
import { getPremiumResolvers } from './types/Premium'
import { ContactFormTC } from './types/ContactForm'
import { PageTC } from './types/Page'

import {
  getCoinbaseChargeResolvers,
  getCoinbaseChargeMutations
} from "./types/Coinbase/CoinbaseCharge";
import {dev, prod} from './config'
import mailgun from 'mailgun.js'
require('dotenv').config()

// BaseUrl is also used in ./utils
// ! This schema expects relative URL's to be returned


const baseUrl = prod.wpEndpoint
const digitalPourUrl = 'https://server.digitalpour.com/DashboardServer/api/v3/MenuItems/54640e97b3b6f60d0887afaa'
const digitalPourKey=process.env.DIGITAL_POUR_KEY
const mailgunUrl = process.env.MAILGUN_URL
const mailgunKey = process.env.MAILGUN_KEY

// * Wordpress
const cocktailResolvers = getCocktailResolvers()
const foodResolvers = getFoodResolvers()
const headerResolvers = getHeaderResolvers()
const locationResolvers = getLocationResolvers()
const reviewResolvers = getReviewResolvers()
const canResolvers = getCanResolvers()
const eventResolvers = getEventResolvers()
const premiumResolvers = getPremiumResolvers()

// * Coinbase
const coinbaseChargeResolvers = getCoinbaseChargeResolvers()

const coinbaseChargeMutations = getCoinbaseChargeMutations()


var mgClient = mailgun.client({
  username: 'api',
  key: mailgunKey || ''
})

GQC.rootMutation().addFields({
  ...coinbaseChargeMutations,
  mailFormData: {
    type: "ContactForm",
    args: {
      to: ["String!"],
      from: "String!",
      subject: "String!",
      formData: "String!"
    },
    resolve: async (_, args) => {
      let mgResponse = {};
      mgClient.messages
        .create("iph.colinmac.me", {
          from: args.from,
          to: args.to,
          subject: args.subject,
          text: args.formData
        })
        .then(msg => console.log(msg))
        .catch(err => console.log(err));

      return mgResponse;
    }
  }
});
GQC.rootQuery().addFields({
  ...cocktailResolvers,
  ...foodResolvers,
  ...headerResolvers,
  ...locationResolvers,
  ...reviewResolvers,
  ...canResolvers,
  ...eventResolvers,
  ...premiumResolvers,
  ...coinbaseChargeResolvers,
  pageBy: {
    type: [PageTC],
    args: {
      id: `Int`,
      slug: `String`
    },
    resolve: (_, args) => {
      if(args.id != null){
        return fetch(`${baseUrl}/pages/${args.id}`).then(r => [r.json()])
      }
      if(args.slug != null){
        return fetch(`${baseUrl}/pages?slug=${args.slug}`).then(r => r.json())
      }
    }
  },
  allPages: {
    type: [PageTC],
    resolve: () =>
      fetch(`${baseUrl}/pages/`).then(r => r.json()),
  },
  allTaps: {
    type: [TapListTC],
    args: {
      location: `Int!`,
    },
    resolve: (_, args) =>
      fetch(`${digitalPourUrl}/${args.location}/Tap?apiKey=${digitalPourKey}`).then(r => r.json()),
  }
})

const schema = GQC.buildSchema(); // returns GraphQLSchema

export default schema;
