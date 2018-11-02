import { GQC } from 'graphql-compose';
import fetch from 'node-fetch';
import mailgun from 'mailgun.js';
import { pubsub } from './subscriptions';

import { getFoodResolvers } from './types/Wordpress/Food';
import { getHeaderResolvers, HeaderTC } from './types/Wordpress/Header';
import { TapListTC } from './types/Wordpress/TapList';
import { getCocktailResolvers } from './types/Wordpress/Cocktail';
import { getLocationResolvers } from './types/Wordpress/Location';
import { getReviewResolvers } from './types/Wordpress/Review';
import { getCanResolvers } from './types/Wordpress/Can';
import { getEventResolvers } from './types/Wordpress/Event';
import { getPremiumResolvers } from './types/Wordpress/Premium';
import { ContactFormTC } from './types/ContactForm';
import { PageTC } from './types/Wordpress/Page';

import {
  getCoinbaseChargeResolvers,
  getCoinbaseChargeMutations
} from './types/Coinbase/CoinbaseCharge';
import CoinbaseEventHookTC, { getCoinbaseEventHookSubscriptions } from './types/Coinbase/CoinbaseEventHook';

import { dev, prod } from './config';

require('dotenv').config();

// ! Wordpress schema expects relative URL's to be returned

// BaseUrl is also used in ./utils
const baseUrl = prod.wpEndpoint;
const digitalPourUrl = 'https://server.digitalpour.com/DashboardServer/api/v3/MenuItems/54640e97b3b6f60d0887afaa';
const digitalPourKey = process.env.DIGITAL_POUR_KEY;
const mailgunUrl = process.env.MAILGUN_URL;
const mailgunKey = process.env.MAILGUN_KEY;

// * SQUARE
// Queries

// Mutations

// Subscriptions

// * WORDPRESS
const cocktailResolvers = getCocktailResolvers();
const foodResolvers = getFoodResolvers();
const headerResolvers = getHeaderResolvers();
const locationResolvers = getLocationResolvers();
const reviewResolvers = getReviewResolvers();
const canResolvers = getCanResolvers();
const eventResolvers = getEventResolvers();
const premiumResolvers = getPremiumResolvers();

// * COINBASE
// -Queries
const coinbaseChargeResolvers = getCoinbaseChargeResolvers();
// -Mutations
const coinbaseChargeMutations = getCoinbaseChargeMutations();
// Subscriptions
const coinbaseEventHookSubscriptions = getCoinbaseEventHookSubscriptions();

const mgClient = mailgun.client({
  username: 'api',
  key: mailgunKey || ''
});

GQC.rootMutation().addFields({
  ...coinbaseChargeMutations,
  mailFormData: {
    type: 'ContactForm',
    args: {
      to: ['String!'],
      from: 'String!',
      subject: 'String!',
      formData: 'String!'
    },
    resolve: async (_, args) => {
      const mgResponse = {};
      mgClient.messages
        .create('iph.colinmac.me', {
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
  ...wcProductResolvers,
  pageBy: {
    type: [PageTC],
    args: {
      id: 'Int',
      slug: 'String'
    },
    resolve: (_, args) => {
      if (args.id != null) {
        return fetch(`${baseUrl}/pages/${args.id}`).then(r => [r.json()]);
      }
      return fetch(`${baseUrl}/pages?slug=${args.slug}`).then(r => r.json());
    }
  },
  allPages: {
    type: [PageTC],
    resolve: () => fetch(`${baseUrl}/pages/`).then(r => r.json())
  },
  allTaps: {
    type: [TapListTC],
    args: {
      location: 'Int!'
    },
    resolve: (_, args) => fetch(`${digitalPourUrl}/${args.location}/Tap?apiKey=${digitalPourKey}`).then(r => r.json())
  }
});

GQC.rootSubscription().addFields({
  ...coinbaseEventHookSubscriptions
});

const schema = GQC.buildSchema(); // returns GraphQLSchema

export default schema;
