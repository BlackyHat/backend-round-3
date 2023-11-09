import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { AppError } from '../utils/app-errors';

const USERS_TABLE = process.env.USERS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

let client: DynamoDBClient;

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
const dbClient = DynamoDBDocumentClient.from(client);

export interface IUser {
  email: string;
  password: string;
  id: string;
  token: string;
}

async function createOne(userData: IUser) {
  const command = new PutCommand({
    TableName: String(USERS_TABLE),
    Item: userData,
  });
  try {
    await dbClient.send(command);
  } catch (error) {
    throw new AppError(500, error.message || 'Error creating new user');
  }
}

async function findOne(email: string): Promise<IUser[]> {
  const query = new QueryCommand({
    TableName: USERS_TABLE,
    IndexName: 'email_idx',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  });

  try {
    const { Items } = await dbClient.send(query);
    return Items as IUser[];
  } catch (error) {
    throw new AppError(500, error.message || 'Could not retreive user');
  }
}
async function findByID(id: string): Promise<IUser | null> {
  const command = new GetCommand({
    TableName: String(USERS_TABLE),
    Key: { id: id },
  });
  try {
    const { Item } = await dbClient.send(command);
    if (!Item) {
      return null;
    }
    return Item as IUser;
  } catch (error) {
    throw new AppError(500, error.message || 'Could not retreive user');
  }
}
async function findByIdAndUpdate(id: string, token: string) {
  const updateCommand = new UpdateCommand({
    TableName: String(USERS_TABLE),
    Key: { id: id },
    UpdateExpression: 'SET #tokenAttr = :newValue',
    ExpressionAttributeNames: {
      '#tokenAttr': 'token',
    },
    ExpressionAttributeValues: {
      ':newValue': token,
    },
    ReturnValues: 'ALL_NEW',
  });
  try {
    const updateResponse = await dbClient.send(updateCommand);
    if (!updateResponse) {
      return null;
    }
    return updateResponse;
  } catch (error) {
    throw new AppError(500, error.message || 'Error updating user data');
  }
}
export { createOne, findOne, findByIdAndUpdate, findByID };
