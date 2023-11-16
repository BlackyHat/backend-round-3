import type { AWS } from '@serverless/typescript';
import {
  signUp,
  signIn,
  authorizer,
  createLink,
  deactivateLink,
  getLinksList,
  redirectToOriginLink,
  deactivateLinkNotify,
  deactivateLinkSchedule,
} from '@/functions';

const serverlessConfiguration: AWS = {
  service: 'awesome-shortlinker-api',
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
      TABLE_NAME: '${self:custom.short_links_table}',
      JWT_SECRET: '${env:JWT_SECRET}',
      TOKEN_TTL: '${env:TOKEN_TTL}',
      EMAIL_SENDER: '${env:EMAIL_SENDER}',
      SQS_QUEUE_URL: { Ref: 'EmailSQSQueue' },
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
              { 'Fn::GetAtt': ['shortLinksTable', 'Arn'] },
              {
                'Fn::Join': [
                  '/',
                  [
                    { 'Fn::GetAtt': ['shortLinksTable', 'Arn'] },
                    'index',
                    'GSI1',
                  ],
                ],
              },
            ],
          },
          {
            Effect: 'Allow',
            Action: [
              'sqs:SendMessage',
              'sqs:ReceiveMessage',
              'sqs:DeleteMessage',
            ],
            Resource: { 'Fn::GetAtt': ['EmailSQSQueue', 'Arn'] },
          },
          {
            Effect: 'Allow',
            Action: ['ses:SendEmail'],
            Resource: '*',
          },
        ],
      },
    },
  },
  functions: {
    signUp,
    signIn,
    authorizer,
    createLink,
    deactivateLink,
    getLinksList,
    redirectToOriginLink,
    deactivateLinkNotify,
    deactivateLinkSchedule,
  },
  package: { individually: true },
  custom: {
    stage: 'dev',
    short_links_table:
      '${self:service}-short-links-table-${opt:stage, self:provider.stage}',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
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
    Resources: {
      shortLinksTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Delete',
        Properties: {
          TableName: '${self:provider.environment.TABLE_NAME}',
          BillingMode: 'PAY_PER_REQUEST',
          KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' },
            { AttributeName: 'SK', KeyType: 'RANGE' },
          ],
          AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
            { AttributeName: 'SK', AttributeType: 'S' },
            { AttributeName: 'GSI1PK', AttributeType: 'S' },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'GSI1',
              KeySchema: [{ AttributeName: 'GSI1PK', KeyType: 'HASH' }],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
          ],
        },
      },
      EmailSQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'sqs-queue-${opt:stage, self:provider.stage}',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
