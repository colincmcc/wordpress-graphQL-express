import { GQC } from 'graphql-compose';
import fetch from 'node-fetch';
import {getFoodResolvers} from './types/Food'
import { getHeaderResolvers, HeaderTC } from './types/Header'
import { TapListTC } from './types/TapList'
import { getCocktailResolvers } from './types/Cocktail'
import { getLocationResolvers } from './types/Location'
import { getReviewResolvers } from './types/Review'
import { getCanResolvers } from './types/Can'
import { getEventResolvers } from './types/Event'
import { getPremiumResolvers } from './types/Premium'
import { PageTC } from './types/Page'
import {dev, prod} from './config'


// BaseUrl is also used in ./utils
// ! This schema expects relative URL's to be returned
const baseUrl = prod.wpEndpoint
const digitalPourUrl = 'https://server.digitalpour.com/DashboardServer/api/v3/MenuItems/54640e97b3b6f60d0887afaa'
const digitalPourKey = '54948fb0b3b6f60a54b37b16'

const cocktailResolvers = getCocktailResolvers()
const foodResolvers = getFoodResolvers()
const headerResolvers = getHeaderResolvers()
const locationResolvers = getLocationResolvers()
const reviewResolvers = getReviewResolvers()
const canResolvers = getCanResolvers()
const eventResolvers = getEventResolvers()
const premiumResolvers = getPremiumResolvers()

GQC.rootQuery().addFields({
  ...cocktailResolvers,
  ...foodResolvers,
  ...headerResolvers,
  ...locationResolvers,
  ...reviewResolvers,
  ...canResolvers,
  ...eventResolvers,
  ...premiumResolvers,
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
