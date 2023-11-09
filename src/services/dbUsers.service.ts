import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { AppError, ConflictError } from '../utils/app-errors';

const USERS_TABLE = process.env.USERS_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;
let client;

if (IS_OFFLINE === 'true') {
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
// const client = new DynamoDBClient({});
const dbClient = DynamoDBDocumentClient.from(client);

interface ICredentials {
  email: string;
  password: string;
  id: string;
  token: string;
}

async function createOne(userData: ICredentials) {
  const command = new PutCommand({
    TableName: String(USERS_TABLE),
    Item: userData,
    ConditionExpression: 'attribute_not_exists(email)',
  });
  try {
    await dbClient.send(command);
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new ConflictError('Email in use.');
    }
    throw new AppError(500, error.message || 'Error creating new user');
  }
}

async function findOne(id: string) {
  // const command = new GetCommand({
  //   TableName: USERS_TABLE,
  //   Key: { email: { S: email } },
  // });
  // try {
  //   const { Item } = await dbClient.send(command);
  //   if (!Item) {
  //     return null;
  //   }
  //   return Item;
  const command = new QueryCommand({
    TableName: USERS_TABLE,
    IndexName: 'id_index',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': { S: id },
    },
  });

  try {
    const { Items } = await dbClient.send(command);
    if (Items && Items.length > 0) {
      return Items[0];
    }
  } catch (error) {
    throw new AppError(500, error.message || 'id=>Could not retreive user');
  }
}
async function findOne2(email: string) {
  // const command = new GetCommand({
  //   TableName: USERS_TABLE,
  //   Key: { email: { S: email } },
  // });
  // try {
  //   const { Item } = await dbClient.send(command);
  //   if (!Item) {
  //     return null;
  //   }
  //   return Item;
  const command = new QueryCommand({
    TableName: USERS_TABLE,
    IndexName: 'email_idx',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': { S: email },
    },
  });

  try {
    const { Items } = await dbClient.send(command);
    if (Items && Items.length > 0) {
      return Items[0];
    }
  } catch (error) {
    throw new AppError(500, error.message || 'email=>Could not retreive user');
  }
}
async function findByID(id: string) {
  const command = new GetCommand({
    TableName: String(USERS_TABLE),
    Key: { id: { S: id } },
  });
  try {
    const { Item } = await dbClient.send(command);
    if (!Item) {
      return null;
    }
    return Item;
  } catch (error) {
    throw new AppError(500, error.message || 'Could not retreive user');
  }
}
async function findByIdAndUpdate(id: string, token: string) {
  const command = new UpdateCommand({
    TableName: String(USERS_TABLE),
    Key: { id: id },
    UpdateExpression: 'set token = :token',
    ExpressionAttributeValues: {
      ':token': token,
    },
    ReturnValues: 'ALL_NEW',
  });
  try {
    const updateResponse = await dbClient.send(command);
    if (!updateResponse) {
      return null;
    }
    return updateResponse;
  } catch (error) {
    throw new AppError(500, 'Error updating user data');
  }
}
export { createOne, findOne, findOne2, findByIdAndUpdate, findByID };
