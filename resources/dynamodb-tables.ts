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
};
