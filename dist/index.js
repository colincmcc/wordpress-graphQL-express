'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

// TODO: incorporate this into ApolloServer
var loadData = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url) {
    var res, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _nodeFetch2.default)(url);

          case 2:
            res = _context.sent;
            _context.next = 5;
            return res.json();

          case 5:
            data = _context.sent;

            if (!(data && data.count && data.results)) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', data.results);

          case 8:
            return _context.abrupt('return', data);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function loadData(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _http = require('http');

var _subscriptions = require('./subscriptions');

var _apolloServerExpress = require('apollo-server-express');

var _graphql = require('graphql');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

// Migrated to ApolloServer from express-graphql
// Better support for subscriptions

var coinbaseHookSecret = process.env.COINBASE_SECRET;
var port = process.env.PORT || 4000;

// Express App Setup
var app = (0, _express2.default)();
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));
app.use(_bodyParser2.default.json({
  verify: function verify(req, res, buf) {
    req.rawBody = buf;
  }
}));
app.options("*", (0, _cors2.default)());
app.use((0, _cors2.default)());

// Validate Coinbase webhook POST requests
function hmacValidator(req, res, next) {
  var sig = req.headers["x-cc-webhook-signature"];
  var hmacBuffer = new Buffer(sig, "hex");

  if (!sig) {

    return res.status(409).json({
      error: 'Missing Signature'
    });
  }

  try {
    var calculated = _crypto2.default.createHmac('sha256', coinbaseHookSecret).update(req.rawBody).digest();
  } catch (e) {

    return res.status(409).json({
      error: 'Invalid signature'
    });
  }
  var hashEquals = false;

  try {
    hashEquals = _crypto2.default.timingSafeEqual(calculated, hmacBuffer);
  } catch (e) {
    hashEquals = false;
  }
  if (hashEquals) {
    return next();
  } else {
    console.log("2");

    return res.status(409).json({
      error: 'Invalid signature'
    });
  }
}

// This endpoint allows us to validate Coinbase POST requests
app.post("/webhooks", hmacValidator, function (req, res) {
  res.send("OK");

  var data = req.body;
  _subscriptions.pubsub.publish("CHARGE_UPDATED", { chargeUpdated: data });
});

// Create Apollo Server and apply its middleware to express server
var apolloServer = new _apolloServerExpress.ApolloServer({
  schema: _schema2.default,
  context: function context() {
    var loader = new _dataloader2.default(function (keys) {
      return _promise2.default.all(keys.map(loadData));
    });
    return { loader: loader };
  }
});
apolloServer.applyMiddleware({ app: app });

// We then wrap the express server and install subscription handlers.  Apollo handles the creation of the subscription websocket below
var httpServer = (0, _http.createServer)(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(port, function () {
  console.log('\uD83D\uDE80 Server ready at http://localhost:' + port + apolloServer.graphqlPath);
  console.log('\uD83D\uDE80 Subscriptions ready at ws://localhost:' + port + apolloServer.subscriptionsPath);
});

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