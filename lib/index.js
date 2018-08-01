import express from 'express';
import graphqlHTTP from 'express-graphql';
import fetch from 'node-fetch';
import Dataloader from 'dataloader';
import schema from './schema';
import cors from 'cors'

const port = process.env.PORT || 4000;
const graphQlServer = express();


async function loadData(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.count && data.results) {
    return data.results;
  }
  return data;
}
graphQlServer.options('*', cors())
graphQlServer.use(cors())

graphQlServer.use(
  '/',
  graphqlHTTP(() => {
    const loader = new Dataloader(keys => Promise.all(keys.map(loadData)));

    return {
      schema,
      graphiql: true,
      context: {
        loader,
      },
    };
  }),
);

// * CONSOLE LOG
graphQlServer.listen(port, () => {
  console.log(`GraphQL Server (with cors) running on port ${port}`);
  console.log(`Visit http://localhost:${port}`);
});