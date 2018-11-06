import { TypeComposer } from 'graphql-compose';
import composeWithJson from 'graphql-compose-json';
import {
  createFindAllWCResolver,
  createFindWCByIdResolver
} from './wcUtils';


const restApiResponse = {
  id: 720,
  code: 'free shipping',
  amount: '0.00',
  date_created: '2017-03-21T15:25:02',
  date_created_gmt: '2017-03-21T18:25:02',
  date_modified: '2017-03-21T15:25:02',
  date_modified_gmt: '2017-03-21T18:25:02',
  discount_type: 'fixed_cart',
  description: '',
  date_expires: null,
  date_expires_gmt: null,
  usage_count: 0,
  individual_use: true,
  product_ids: [],
  excluded_product_ids: [],
  usage_limit: null,
  usage_limit_per_user: null,
  limit_usage_to_x_items: null,
  free_shipping: true,
  product_categories: [],
  excluded_product_categories: [],
  exclude_sale_items: false,
  minimum_amount: '0.00',
  maximum_amount: '0.00',
  email_restrictions: [],
  used_by: [],
  meta_data: [],
  _links: {
    self: [
      {
        href: 'https://example.com/wp-json/wc/v3/coupons/720'
      }
    ],
    collection: [
      {
        href: 'https://example.com/wp-json/wc/v3/coupons'
      }
    ]
  }
};


export const WooCouponTC = composeWithJson('WooCoupon', restApiResponse);


export const WooCouponGraphQLType = WooCouponTC.getType();

// Query Resolvers
createFindAllWCResolver(WooCouponTC, 'coupons');

// Mutation Resolvers

// Subscription Resolvers

export function getWooCouponQueries() {
  return {
    allCoupons: WooCouponTC.getResolver('findAllWC')
  };
}

export function getWooCouponMutations() {
  return {
  };
}

export function getWooCouponSubscriptions() {
  return {

  };
}

export default WooCouponTC;
