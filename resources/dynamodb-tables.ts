export default {
  usersTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      TableName: '${self:provider.environment.USERS_TABLE}',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        // { AttributeName: 'links', KeyType: 'range' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' },
        { AttributeName: 'password', AttributeType: 'S' },
        { AttributeName: 'token', AttributeType: 'S' },
        { AttributeName: 'links', AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: '${self:custom.table_throughput}',
        WriteCapacityUnits: '${self:custom.table_throughput}',
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'email_idx',
          KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
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
  // linksTable: {
  //   Type: 'AWS::DynamoDB::Table',
  //   DeletionPolicy: 'Retain',
  //   Properties: {
  //     TableName: '${self:provider.environment.LINKS_TABLE}',
  //     AttributeDefinitions: [
  //       { AttributeName: 'id', AttributeType: 'S' },
  //       { AttributeName: 'userId', AttributeType: 'S' },
  //       { AttributeName: 'shortLink', AttributeType: 'S' },
  //       { AttributeName: 'originalLink', AttributeType: 'S' },
  //     ],
  //     KeySchema: [
  //       { AttributeName: 'id', KeyType: 'HASH' },
  //       { AttributeName: 'userId', KeyType: 'RANGE' },
  //     ],
  //     ProvisionedThroughput: {
  //       ReadCapacityUnits: '${self:custom.table_throughput}',
  //       WriteCapacityUnits: '${self:custom.table_throughput}',
  //     },
  //     GlobalSecondaryIndexes: [
  //       {
  //         IndexName: 'users_index',
  //         KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
  //         Projection: {
  //           ProjectionType: 'ALL',
  //         },
  //         ProvisionedThroughput: {
  //           ReadCapacityUnits: '${self:custom.table_throughput}',
  //           WriteCapacityUnits: '${self:custom.table_throughput}',
  //         },
  //       },
  //     ],
  //   },
  // },
};
