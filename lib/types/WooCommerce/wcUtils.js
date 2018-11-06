import WcAPI from 'woocommerce-api';

require('dotenv').config();


/**
 * * WOOCOMMERCE RESOLVER FUNCTIONS
 */

const wc = new WcAPI({
  url: process.env.WOO_ENDPOINT,
  consumerKey: process.env.WOO_CONSUMER_KEY,
  consumerSecret: process.env.WOO_CONSUMER_SECRET,
  wpAPI: true,
  version: 'wc/v2'
});

export const wcGet = async (endpoint) => {
  const payload = await wc.getAsync(endpoint);
  const result = JSON.parse(payload.toJSON().body);
  return result;
};

export const wcPost = async (endpoint, data) => {
  const payload = await wc.postAsync(endpoint, data);
  return JSON.parse(payload.toJSON().body);
};

export const reviewsSelected = (info) => {
  const selections = info.fieldNodes[0].selectionSet.selections
    .filter(selection => selection.name.value === 'reviews');
  return selections.length > 0;
};

export const validate = async (token) => {
  const result = await fetch(`${process.env.WOOCOMMERCE_ENDPOINT}/wp-json/jwt-auth/v1/token/validate`, {
    method: 'post',
    headers: {
      Authorization: token
    }
  })
    .then(res => res.json())
    .then(json => json.data.status);
  return result === 200;
};

// ! Base64 decoding without external library
export const getUser = (token) => {
  const tokenParse = JSON.parse(Buffer.from(token.split('.')[1]), 'base64');
  const userId = tokenParse.data.user.id;
  return userId;
};

export function createFindAllWCResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findAllWC',
    type: [tc],
    resolve: async ({ args, context }) => {
      const wcResult = await wcGet(urlAddr);
      return wcResult;
    }
  });
}

export function createFindWCByIdResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findProductsById',
    type: tc,
    args: {
      id: 'Int!'
    },
    resolve: async ({ args, context }) => {
      const wcResultArray = await wcGet(`${urlAddr}/${args.id}`);

      const wcResult = wcResultArray[0];
      return wcResult;
    }
  });
}

export function createFindWCBySlugResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findAllProducts',
    type: tc,
    args: {
      slug: 'String!'
    },
    resolve: async ({ args, context }) => {
      const wcResultArray = await wcGet(`${urlAddr}/?&slug=${args.slug}`);

      const wcResult = wcResultArray[0];
      return wcResultArray;
    }
  });
}

export function createFindWCByTagResolver(tc, urlAddr) {
  tc.addResolver({
    name: 'findProductsByTag',
    type: tc,
    args: {
      tag: 'String!'
    },
    resolve: async ({ args, context }) => {
      const wcResult = await wcGet(`${urlAddr}/?&tag=${args.tag}`);

      return wcResult;
    }
  });
}
