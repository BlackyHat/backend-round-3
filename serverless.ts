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
  deactivateLinks,
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
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
            ],
            Resource: [
              { 'Fn::GetAtt': ['usersTable', 'Arn'] },
              { 'Fn::GetAtt': ['linksTable', 'Arn'] },
              {
                'Fn::Join': [
                  '/',
                  [
                    { 'Fn::GetAtt': ['usersTable', 'Arn'] },
                    'index',
                    'email_idx',
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '/',
                  [
                    { 'Fn::GetAtt': ['linksTable', 'Arn'] },
                    'index',
                    'userId_idx',
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '/',
                  [
                    { 'Fn::GetAtt': ['linksTable', 'Arn'] },
                    'index',
                    'shortLink_idx',
                  ],
                ],
              },
              // { 'Fn::Sub:': '${usersTable.Arn}/index/*' },
              // { 'Fn::Sub:': '${linksTable.Arn}/index/*' },
              // !Sub "${MessagesDynamoDBTable.Arn}/index/*"
              // { 'Fn::GetAtt': ['linksTable/index/*', 'Arn'] },
              // { "arn:aws:dynamodb:${aws:region}:*:table/${self:provider.environment.DYNAMODB_TABLE}"},
            ],
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
    deactivateLinks,
  },
  package: { individually: true },
  custom: {
    stage: 'dev',
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
