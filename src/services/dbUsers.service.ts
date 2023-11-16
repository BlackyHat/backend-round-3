import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

import { IUser } from '@/models/user.model';
import { docClient } from '@/libs/dynamoDBClient';

const TABLE = String(process.env.TABLE_NAME);
const createUserPK = (id: string) => 'USER#'.concat(id);

async function createOne(userData: IUser) {
  const command = new PutCommand({
    TableName: TABLE,
    Item: userData,
    ConditionExpression: 'attribute_not_exists(PK)',
  });
  try {
    await docClient.send(command);
  } catch (error) {
    throw new Error(error || 'Error creating new user');
  }
}

async function findOne(index: string) {
  const query = new QueryCommand({
    TableName: TABLE,
    IndexName: 'GSI1',
    KeyConditionExpression: 'GSI1PK = :index',
    ExpressionAttributeValues: {
      ':index': index,
    },
  });

  try {
    const { Items } = await docClient.send(query);
    if (!Array.isArray(Items)) {
      throw new Error('Could not retreive user');
    }
    return Items;
  } catch (error) {
    throw new Error(error.message || 'Could not retreive user');
  }
}

async function findByID(userId: string) {
  const command = new GetCommand({
    TableName: TABLE,
    Key: { PK: createUserPK(userId), SK: createUserPK(userId) },
  });

  try {
    const { Item } = await docClient.send(command);
    if (!Item) {
      throw new Error('Could not retreive user');
    }
    return Item as IUser;
  } catch (error) {
    throw new Error(error.message || 'Could not retreive user');
  }
}

async function findByIdAndUpdate(userId: string, access_token: string) {
  const updateCommand = new UpdateCommand({
    TableName: TABLE,
    Key: { PK: createUserPK(userId), SK: createUserPK(userId) },
    UpdateExpression: 'SET #access_token = :newToken',
    ExpressionAttributeNames: {
      '#access_token': 'access_token',
    },
    ExpressionAttributeValues: {
      ':newToken': access_token,
    },
    ReturnValues: 'ALL_NEW',
  });

  try {
    const updateResponse = await docClient.send(updateCommand);
    if (!updateResponse) {
      throw new Error('Error updating user data');
    }
    return updateResponse;
  } catch (error) {
    throw new Error(error.message || 'Error updating user data');
  }
}
export { createOne, findOne, findByIdAndUpdate, findByID };
