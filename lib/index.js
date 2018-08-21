import express from 'express';
import crypto from 'crypto';
import { createServer } from "http";
import { pubsub } from './subscriptions'
import { ApolloServer } from "apollo-server-express";
import { execute, subscribe } from "graphql";
import bodyParser from "body-parser";
import { SubscriptionServer } from 'subscriptions-transport-ws';

import fetch from 'node-fetch';
import Dataloader from 'dataloader';
import schema from './schema';
import cors from 'cors'
require('dotenv').config()

// Migrated to ApolloServer from express-graphql
// Better support for subscriptions

const coinbaseHookSecret = process.env.COINBASE_SECRET;
const port = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(
  bodyParser.json({
    verify: function(req, res, buf) {
      req.rawBody = buf;
    }
  })
);


function hmacValidator (req, res, next ) {
  let sig = req.headers["x-cc-webhook-signature"];
  const hmacBuffer = new Buffer(sig, "hex");

  if (!sig) {

    return res.status(409).json({
      error: 'Missing Signature',
    })
  }

  try {
    var calculated = crypto
      .createHmac('sha256', coinbaseHookSecret)
      .update(req.rawBody)
      .digest();
  } catch (e) {

    return res.status(409).json({
      error: 'Invalid signature',
    });
  }
  var hashEquals = false;

  try {
    hashEquals = crypto.timingSafeEqual(calculated, hmacBuffer)
  } catch (e) {
    hashEquals = false;
  }


  if (hashEquals) {

    return next();
  } else {
    console.log("2")

    return res.status(409).json({
      error: 'Invalid signature',
    });
  }

}
app.post("/webhooks", hmacValidator, (req, res) => {
  res.send("OK");

  const data = req.body;
  pubsub.publish("chargeUpdated", data);
});

const server = new ApolloServer({
  schema,
  playground: true,
  subscriptions: 'ws://localhost:4000/subscriptions',
  cors: true
});
server.applyMiddleware({ app });

// TODO: incorporate this into ApolloServer
async function loadData(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.count && data.results) {
    return data.results;
  }
  return data;
}
app.options("*", cors());
app.use(cors());


const httpServer = createServer(app);

server.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () =>{
    new SubscriptionServer({
        execute,
        subscribe,
        schema
      }, {
          server: ws,
          path: '/subscriptions',
        })
      console.log(`Apollo Server is now running on http://localhost:${port}`)
      }
    );


/**
app.use(
  "/graphql",
  graphqlHTTP(() => {
    const loader = new Dataloader(keys => Promise.all(keys.map(loadData)));
    return {
      schema,
      graphiql: true,
      context: {
        loader
      }
    };
  })
);


// * CONSOLE LOG
app.listen(port, () => {
  console.log(`GraphQL Server (with cors) running on port ${port}`);
  console.log(`Visit http://localhost:${port}`);
});

 */