require("dotenv").config();
import { TypeComposer } from 'graphql-compose';
import axios from 'axios'
import {dev, prod} from './config'

const baseUrl = prod.wpEndpoint

const coinbaseEndpoint = prod.coinbaseCommerceUrl
const coinbaseKey = process.env.COINBASE_KEY
const coinbaseSecret = process.env.COINBASE_SECRET
const coinbaseApiVersion = process.env.COINBASE_API_VER


/**
 * * WORDPRESS RESOLVER FUNCTIONS
 */
// * Find one by ID
export function createFindByIdResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findById',
    type: tc,
    args: {
      id: 'Int!',
    },
    resolve: async rp => {
      return rp.context.loader.load(`${baseUrl}/${urlAddr}/${rp.args.id}/`);
    },
  });
}

// * Resolve a list of urls
export function createFindByUrlListResolver(tc){
  tc.addResolver({
    name: 'findByUrlList',
    type: [tc],
    resolve: rp => {
      return rp.context.loader.loadMany(rp.args.urls);
    },
  });
}

// * Resolve a list of IDs
export function createFindByIdListResolver(tc, urlAddr){
  tc.addResolver({
    name: 'findByIdList',
    type: [tc],
    resolve: rp => {
     const urlList = rp.args.ids.map(id => [`${baseUrl}/${urlAddr}/${id}`])
      return rp.context.loader.loadMany(urlList);
    },
  });
}

// * Find all of a post type
export function createFindAllResolver(tc, urlAddr){
  tc.addResolver({
    name: 'findAll',
    type: [tc],
    resolve: rp => {
      return rp.context.loader.load(`${baseUrl}/${urlAddr}/`);
    },
  });
}

// * Find all of a post type with a given meta value
export function createFindByMetaResolver(tc, urlAddr, metaType){
  tc.addResolver({
    name: 'findByMeta',
    type: [tc],
    args: {
      [metaType]: 'String!',
    },
    resolve: rp => {
      return rp.context.loader.load(`${baseUrl}/${urlAddr}?${metaType}=${rp.args[[metaType]]}`)
    },
  });
}


/**
 * *COINBASE RESOLVER FUNCTIONS
 */
const coinbaseInstance = axios.create({
  baseURL: coinbaseEndpoint,
  timeout: 5000,
  headers: {
    'X-CC-Api-Key': `${coinbaseKey}`,
    'X-CC-Version': `${coinbaseApiVersion}`,
    'Content-Type': 'application/json'
  }
});

// * Find all Coinbase events
export function createFindAllCbResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findAllCb',
    type: [tc],
    args: {
    },
    resolve: async rp => {

      const responseData = coinbaseInstance.get(`/${urlAddr}`).then((response) => response.data.data
      ).catch((error) => {
        // handle error
        console.log(error);
      })
      return await responseData;
    },
  });
}

// * Find a Coinbase event based on id
export function createFindCbByIdResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findCbById',
    type: tc,
    args: {
      id: 'String!'
     },
    resolve: async rp => {
      const responseData = coinbaseInstance
        .get(`/${urlAddr}/${rp.args.id}`)
        .then(response => response.data.data)
        .catch(error => {
          // handle error
          console.log(error);
        });
        return await responseData
    },
  });
}

// * Create Coinbase event
export function createCreateCbResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'createCb',
    type: tc,
    args: {
      name: 'String',
      description: 'String',
      amount: 'String',
      pricingType: 'String',
      custId: 'String',
      custName: 'String'
    },
    resolve: async rp => {
      const data = {
        name: rp.args.name,
        description: rp.args.description,
        local_price: {
          amount: rp.args.amount,
          currency: 'USD'
        },
        pricing_type: rp.args.pricingType,
        metadata: {
          customer_id: rp.args.custId,
          customer_name: rp.args.custName
        }
      }

      const responseData = coinbaseInstance.post(`/${urlAddr}`, data).then( (response) => response.data.data
      ).catch((error) => {
        // handle error
        console.log(error);
      })
      console.log(await responseData)
      return await responseData
    },
  });
}