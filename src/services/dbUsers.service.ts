import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

import { IUser } from '@/models/user.model';
import { docClient } from '@/libs/dynamoDBClient';

const { USERS_TABLE } = process.env;

async function createOne(userData: IUser) {
  const command = new PutCommand({
    TableName: String(USERS_TABLE),
    Item: userData,
  });
  try {
    await docClient.send(command);
  } catch (error) {
    throw new Error(error.message || 'Error creating new user');
  }
}

async function findOne(email: string) {
  const query = new QueryCommand({
    TableName: String(USERS_TABLE),
    IndexName: 'email_idx',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
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
async function findByID(id: string) {
  const command = new GetCommand({
    TableName: String(USERS_TABLE),
    Key: { id: id },
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
async function findByIdAndUpdate(id: string, token: string) {
  const updateCommand = new UpdateCommand({
    TableName: String(USERS_TABLE),
    Key: { id: id },
    UpdateExpression: 'SET #token = :newToken',
    ExpressionAttributeNames: {
      '#token': 'token',
    },
    ExpressionAttributeValues: {
      ':newToken': token,
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
