import { createTodo, getTodo, getAllTodos, updateTodo, deleteTodo } from '@functions/todo';
const serverlessConfiguration = {
    service: 'backend-round-3',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        profile: 'sls',
        stage: 'dev',
        stackName: '${self:service}-stack-${self:provider.stage}',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    iam: {
        role: {
            statements: [{
                    Effect: "Allow",
                    Action: [
                        "dynamodb:DescribeTable",
                        "dynamodb:Query",
                        "dynamodb:Scan",
                        "dynamodb:GetItem",
                        "dynamodb:PutItem",
                        "dynamodb:UpdateItem",
                        "dynamodb:DeleteItem",
                    ],
                    Resource: "arn:aws:dynamodb:us-west-2:*:table/TodosTable",
                }],
        },
    },
    functions: { createTodo, getTodo, getAllTodos, updateTodo, deleteTodo },
    functions: {
        app: {
            handler: 'index.handler',
            events: {
                http: 'ANY /',
                http: 'ANY {proxy+}'
            }
        },
        getUser: {
            handler: 'index.handler',
            events: [
                {
                    http: {
                        method: 'get',
                        path: '/users/{proxy+}',
                        authorizer: 'authorizerFunc',
                    }
                }
            ]
        },
        createUser: {
            handler: 'index.handler',
            events: [
                {
                    http: {
                        method: 'post',
                        path: '/users',
                    }
                }
            ]
        },
        authorizerFunc: {
            handler: 'handler.authorizerFunc',
        }
    },
    package: { individually: true },
    custom: {
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
            },
            stages: "dev"
        },
        ['serverless-offline']: {
            httpPort: 3000,
            babelOptions: {
                presets: ["env"]
            }
        }
    },
    resources: {
        Resources: {
            ListTable: {
                Type: 'AWS::DynamoDB::Table',
                DeletionPolicy: 'Retain',
                Properties: {
                    TableName: '${self:provider.environment.LIST_TABLE}',
                    AttributeDefinitions: [
                        { AttributeName: 'id', AttributeType: 'S' }
                    ],
                    KeySchema: [
                        { AttributeName: 'id', KeyType: 'HASH' }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: '${self:custom.TABLE_THROUGHPUT}',
                        WriteCapacityUnits: '${self:custom.TABLE_THROUGHPUT}'
                    }
                }
            },
            TasksTable: {
                Type: 'AWS::DynamoDB::Table',
                DeletionPolicy: 'Retain',
                Properties: {
                    TableName: '${self:provider.environment.TASKS_TABLE}',
                    AttributeDefinitions: [
                        { AttributeName: 'id', AttributeType: 'S' },
                        { AttributeName: 'listId', AttributeType: 'S' }
                    ],
                    KeySchema: [
                        { AttributeName: 'id', KeyType: 'HASH' },
                        { AttributeName: 'listId', KeyType: 'RANGE' }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: '${self:custom.TABLE_THROUGHPUT}',
                        WriteCapacityUnits: '${self:custom.TABLE_THROUGHPUT}'
                    }
                }
            },
            UsersDynamoDBTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    AttributeDefinitions: [{
                            AttributeName: 'userId',
                            AttributeType: 'S',
                        }],
                    KeySchema: [{
                            AttributeName: 'userId',
                            KeyType: 'HASH'
                        }],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                    TableName: $
                }
            }
        }
    }
}, { self: custom, tableName };
;
module.exports = serverlessConfiguration;
//# sourceMappingURL=serverless.js.map