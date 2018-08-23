"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoinbaseChargeGraphQLType = undefined;
exports.getCoinbaseChargeResolvers = getCoinbaseChargeResolvers;
exports.getCoinbaseChargeMutations = getCoinbaseChargeMutations;
exports.getCoinbaseChargeSubscriptions = getCoinbaseChargeSubscriptions;

var _graphqlCompose = require("graphql-compose");

var _graphqlComposeJson = require("graphql-compose-json");

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restApiResponse = {
  id: "f765421f2-1451-fafb-a513-aac6c819fba9",
  resource: "charge",
  code: "66BEOV2A",
  name: "The Sovereign Individual",
  description: "Mastering the Transition to the Information Age",
  logo_url: "https://commerce.coinbase.com/charges/ybjknds.png",
  hosted_url: "https://commerce.coinbase.com/charges/66BEOV2A",
  created_at: "2017-01-31T20:49:02Z",
  expires_at: "2017-01-31T21:49:02Z",
  confirmed_at: "2017-01-31T20:50:02Z",
  checkout: {
    id: "a76721f2-1611-48fb-a513-aac6c819a9d6"
  },
  timeline: [{
    time: "2017-01-31T20:49:02Z",
    status: "NEW"
  }],
  metadata: {
    customer_name: "name",
    customer_id: "custid"
  },
  pricing_type: "fixed_price",
  pricing: {
    local: { amount: "100.00", currency: "USD" },
    bitcoin: { amount: "1.00", currency: "BTC" },
    ethereum: { amount: "10.00", currency: "ETH" }
  },
  payments: [{
    network: "ethereum",
    transaction_id: "0xe02fead885c3e4019945428ed54d094247bada2d0ac41b08fce7ce137bf29587",
    status: "CONFIRMED",
    value: {
      local: { amount: "100.0", currency: "USD" },
      crypto: { amount: "10.00", currency: "ETH" }
    },
    block: {
      height: 100,
      hash: "0xe02fead885c3e4019945428ed54d094247bada2d0ac41b08fce7ce137bf29587",
      confirmations_accumulated: 8,
      confirmations_required: 2
    }
  }],
  addresses: {
    bitcoin: "mymZkiXhQNd6VWWG7VGSVdDX9bKmviti3U",
    ethereum: "0x419f91df39951fd4e8acc8f1874b01c0c78ceba6"
  }
};

var CoinbaseChargeTC = (0, _graphqlComposeJson2.default)("CoinbaseCharge", restApiResponse);

var CoinbaseChargeGraphQLType = exports.CoinbaseChargeGraphQLType = CoinbaseChargeTC.getType();

// Query Resolvers
(0, _utils.createFindAllCbResolver)(CoinbaseChargeTC, 'charges');
(0, _utils.createFindCbByIdResolver)(CoinbaseChargeTC, 'charges');

// Mutation Resolvers
(0, _utils.createCreateCbResolver)(CoinbaseChargeTC, 'charges');

// Subscription Resolvers
(0, _utils.createSubEventUpdatedResolver)(CoinbaseChargeTC, "charge:created");

function getCoinbaseChargeResolvers() {
  return {
    allChargeEvents: CoinbaseChargeTC.getResolver("findAllCb"),
    getCbCharge: CoinbaseChargeTC.getResolver("findCbById") };
}
function getCoinbaseChargeMutations() {
  return {
    createCbCharge: CoinbaseChargeTC.getResolver('createCb')
  };
}

function getCoinbaseChargeSubscriptions() {
  return { subscribeCbCharge: CoinbaseChargeTC.getResolver("subEventAdded") };
}

exports.default = CoinbaseChargeTC;