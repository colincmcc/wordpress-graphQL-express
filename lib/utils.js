import { TypeComposer } from 'graphql-compose';
import fetch from 'node-fetch';
import {dev, prod} from './config'

const baseUrl = prod.wpEndpoint

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