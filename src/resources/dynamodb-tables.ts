export default {
  usersTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Delete',
    Properties: {
      TableName: '${self:provider.environment.USERS_TABLE}',
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'email_idx',
          KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
    },
  },
  linksTable: {
    Type: 'AWS::DynamoDB::Table',
    DeletionPolicy: 'Delete',
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
      GlobalSecondaryIndexes: [
        {
          IndexName: 'userId_idx',
          KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
        {
          IndexName: 'shortLink_idx',
          KeySchema: [{ AttributeName: 'shortLink', KeyType: 'HASH' }],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
    },
  },
};
