import type { AWS } from '@serverless/typescript';
import dynamoDbTables from '@/resources/dynamodb-tables';
import {
  signUp,
  signIn,
  authorizerFunc,
  createLink,
  deactivateLink,
  getLinksList,
  redirectToOriginLink,
} from '@/functions';

const serverlessConfiguration: AWS = {
  service: 'backend-round-3',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'eu-north-1',
    stage: 'dev',
    stackName: '${self:service}-stack-${self:custom.stage}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      USERS_TABLE: '${self:custom.users_table}',
      LINKS_TABLE: '${self:custom.links_table}',
      JWT_SECRET: '${env:JWT_SECRET}',
      TOKEN_TTL: '${env:TOKEN_TTL}',
    },
    iam: {
      role: {
        statements: [
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
            Resource: [{ 'Fn::GetAtt': ['usersTable', 'Arn'] }],
          },
        ],
      },
    },
  },
  functions: {
    signUp,
    signIn,
    authorizerFunc,
    createLink,
    deactivateLink,
    getLinksList,
    redirectToOriginLink,
  },
  package: { individually: true },
  custom: {
    stage: 'dev',
    table_throughputs: {
      prod: 5,
      default: 1,
    },
    table_throughput:
      '${self:custom.table_throughputs.${self:custom.stage}, self:custom.table_throughputs.default}',
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
    ['serverless-dynamodb']: {
      start: {
        port: 8000,
        docker: false,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true,
      },
      stages: 'dev',
    },
  },
  resources: {
    Resources: dynamoDbTables,
  },
};

module.exports = serverlessConfiguration;
