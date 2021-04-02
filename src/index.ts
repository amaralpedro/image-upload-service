import * as Express from "express";
import * as ServerlessHttp from "serverless-http";

import routes from "./routes";


const app: Express.Application = Express();

app.use(Express.json())
app.use('/api', routes);

const request = (req, event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const requestContext = event.requestContext;
  req.context = requestContext;
  req.userId = requestContext.authorizer.jwt.claims['cognito:username'];
};

module.exports.handler = ServerlessHttp(app, { request });
