export default {
  usersTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      TableName: '${self:provider.environment.USERS_TABLE}',
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'password', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'password', KeyType: 'RANGE' },
        { AttributeName: 'email', KeyType: 'RANGE' },
      ],
      // ProvisionedThroughput: {
      //   ReadCapacityUnits: '${self:custom.TABLE_THROUGHPUT}',
      //   WriteCapacityUnits: '${self:custom.TABLE_THROUGHPUT}',
      // },
    },
  },
  linksTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Retain',
    Properties: {
      TableName: '${self:provider.environment.LINKS_TABLE}',
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'shortURL', AttributeType: 'S' },
        { AttributeName: 'originalURL', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' },
        { AttributeName: 'userId', KeyType: 'RANGE' },
        { AttributeName: 'shortURL', KeyType: 'RANGE' },
        { AttributeName: 'originalURL', KeyType: 'RANGE' },
      ],
      // ProvisionedThroughput: {
      //   ReadCapacityUnits: '${self:custom.TABLE_THROUGHPUT}',
      //   WriteCapacityUnits: '${self:custom.TABLE_THROUGHPUT}',
      // },
    },
  },
};
