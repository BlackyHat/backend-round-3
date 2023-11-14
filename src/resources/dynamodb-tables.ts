export default {
  usersTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      TableName: '${self:provider.environment.USERS_TABLE}',
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: '${self:custom.table_throughput}',
        WriteCapacityUnits: '${self:custom.table_throughput}',
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'email_idx',
          KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
          AttributeDefinitions: [
            { AttributeName: 'email', AttributeType: 'S' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: '${self:custom.table_throughput}',
            WriteCapacityUnits: '${self:custom.table_throughput}',
          },
        },
      ],
    },
  },
  linksTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      TableName: '${self:provider.environment.LINKS_TABLE}',
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'userId', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'shortLink', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: '${self:custom.table_throughput}',
        WriteCapacityUnits: '${self:custom.table_throughput}',
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'userId_idx',
          KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
          AttributeDefinitions: [
            { AttributeName: 'userId', AttributeType: 'S' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: '${self:custom.table_throughput}',
            WriteCapacityUnits: '${self:custom.table_throughput}',
          },
        },
        {
          IndexName: 'shortLink_idx',
          KeySchema: [{ AttributeName: 'shortLink', KeyType: 'HASH' }],
          AttributeDefinitions: [
            { AttributeName: 'shortLink', AttributeType: 'S' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: '${self:custom.table_throughput}',
            WriteCapacityUnits: '${self:custom.table_throughput}',
          },
        },
      ],
    },
  },
};
