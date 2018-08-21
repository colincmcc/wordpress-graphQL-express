import { TypeComposer } from "graphql-compose";
import composeWithJson from "graphql-compose-json";
import {
createSubEventUpdatedResolver
} from "../../utils";
import { CoinbaseChargeTC, CoinbaseChargeGraphQLType} from "./CoinbaseCharge";

const restApiResponse = {
  attempt_number: 12,
  event: {
    api_version: "2018-03-22",
    created_at: "2018-08-20T19:33:37Z",
    data: () => ({
      type: CoinbaseChargeTC
    }),
    id: "9d96700b-ffb0-4076-9332-e36efb53dba8",
    resource: "event",
    type: "charge:created"
  },
  id: "18201564-de3c-4273-b00a-f1c9cdeb6955",
  scheduled_for: "2018-08-20T23:40:00Z"
};

const CoinbaseEventHookTC = composeWithJson("CoinbaseEventHook", restApiResponse);

export const CoinbaseEventHookGraphQLType = CoinbaseEventHookTC.getType();

// Subscription Resolvers
createSubEventUpdatedResolver(CoinbaseEventHookTC, "chargeUpdated");

export function getCoinbaseEventHookSubscriptions() {
  return { chargeUpdated: CoinbaseEventHookTC.getResolver("subEventUpdated") };
}

export default CoinbaseChargeTC;