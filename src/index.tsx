// import * as serverlessExpress from 'aws-serverless-express';
// import { APIGatewayProxyHandler } from 'aws-lambda';
import serverless from 'serverless-http';
import { app } from './app';

module.exports.handler = serverless(app);

// const server = serverlessExpress.createServer(app);

// export const handler: APIGatewayProxyHandler = (event, context) => {
//   serverlessExpress.proxy(server, event, context);
// };
