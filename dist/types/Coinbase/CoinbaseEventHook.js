"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoinbaseEventHookGraphQLType = undefined;

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _restApiResponse;

exports.getCoinbaseEventHookSubscriptions = getCoinbaseEventHookSubscriptions;

var _graphqlCompose = require("graphql-compose");

var _graphqlComposeJson = require("graphql-compose-json");

var _graphqlComposeJson2 = _interopRequireDefault(_graphqlComposeJson);

var _apolloServer = require("apollo-server");

var _CoinbaseCharge = require("./CoinbaseCharge");

var _subscriptions = require("../../subscriptions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var restApiResponse = (_restApiResponse = {
  id: 1,
  scheduled_for: 'time',
  attempt_number: 12,
  event: {
    api_version: "2018-03-22",
    created_at: "2018-08-20T19:33:37Z",
    data: {
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
    },
    id: "9d96700b-ffb0-4076-9332-e36efb53dba8",
    resource: "event",
    type: "charge:created"
  }
}, (0, _defineProperty3.default)(_restApiResponse, "id", "18201564-de3c-4273-b00a-f1c9cdeb6955"), (0, _defineProperty3.default)(_restApiResponse, "scheduled_for", "2018-08-20T23:40:00Z"), _restApiResponse);

var CoinbaseEventHookTC = (0, _graphqlComposeJson2.default)("CoinbaseEventHook", restApiResponse);

var CoinbaseEventHookGraphQLType = exports.CoinbaseEventHookGraphQLType = CoinbaseEventHookTC.getType();

function getCoinbaseEventHookSubscriptions() {

  return {
    chargeUpdatedById: {
      type: CoinbaseEventHookTC,
      args: {
        id: 'Int!'
      },
      resolve: function resolve(payload) {
        return payload.chargeUpdated;
      },
      subscribe: (0, _apolloServer.withFilter)(function () {
        return _subscriptions.pubsub.asyncIterator("CHARGE_UPDATED");
      }, function (payload, variables) {
        /**
        return payload.chargeUpdated.event.data.id === variables.id
        */
        return payload.chargeUpdated.id === variables.id;
      })
    },
    allChargesUpdated: {
      type: CoinbaseEventHookTC,
      resolve: function resolve(payload) {
        return payload.chargeUpdated;
      },
      subscribe: function subscribe() {
        return _subscriptions.pubsub.asyncIterator("CHARGE_UPDATED");
      }
    }
  };
}

exports.default = CoinbaseEventHookTC;