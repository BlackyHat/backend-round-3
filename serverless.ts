import type { AWS } from '@serverless/typescript';
import dynamoDbTables from './resources/dynamodb-tables';

const serverlessConfiguration: AWS = {
  service: 'backend-round-3',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb-local',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'sls',
    region: 'eu-north-1',
    stage: 'dev',
    stackName: '${self:service}-stack-${sls.stage}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      USERS_TABLE: '${self:custom.users_table}',
      LINKS_TABLE: '${self:custom.links_table}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: { 'Fn::GetAtt': ['usersTable', 'Arn'] },
      },
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: { 'Fn::GetAtt': ['linksTable', 'Arn'] },
      },
    ],
  },
  functions: {
    app: {
      handler: 'src/index.handler',
      events: [
        {
          http: {
            method: 'any',
            path: '/',
          },
        },
        {
          http: {
            method: 'any',
            path: '/{proxy+}',
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    users_table:
      '${self:service}-users-table-${opt:stage, self:provider.stage}',
    links_table:
      '${self:service}-links-table-${opt:stage, self:provider.stage}',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      start: {
        port: 5000,
        inMemory: true,
        migrate: true,
        heapInitial: '200m',
        heapMax: '1g',
        seed: true,
        convertEmptyValues: true,
      },
      stages: ['dev'],
    },
    ['serverless-offline']: {
      httpPort: 3000,
      babelOptions: {
        presets: ['env'],
      },
    },
  },
  resources: {
    Resources: dynamoDbTables,
  },
};

module.exports = serverlessConfiguration;

// TODO: add table
// getUser: {
//   handler: 'index.handler',
//   events: [
//     {
//     http: {
//         method: 'get',
//         path: '/users/{proxy+}',
//         authorizer: 'authorizerFunc',
//         //     name: authorizerFunc
//         // resultTtlInSeconds: 0
//         // identitySource: method.request.header.Authorization
//         // identityValidationExpression: someRegex
//         // type: token
//       }
//     }
//   ]
// }
// createUser: {
//   handler: 'index.handler',
//   events: [
//     {
//     http: {
//         method: 'post',
//         path: '/users',

//       }
//     }
//   ]
// }
// authorizerFunc: {
//   handler: 'handler.authorizerFunc',
// }
