import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

let client: DynamoDBClient;
if (process.env.IS_OFFLINE === 'true') {
  client = new DynamoDBClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    credentials: {
      accessKeyId: 'MockAccessKeyId',
      secretAccessKey: 'MockSecretAccessKey',
    },
  });
} else {
  client = new DynamoDBClient({});
}

const docClient = DynamoDBDocumentClient.from(client);
export { docClient };
