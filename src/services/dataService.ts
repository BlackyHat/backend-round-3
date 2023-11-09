import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  //   GetCommand,
  //   PutCommand,
  //   UpdateCommand,
  //   QueryCommand,
} from '@aws-sdk/lib-dynamodb';
const IS_OFFLINE = process.env.IS_OFFLINE;

import { AppError } from 'src/utils/app-errors';

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
const documentClient = DynamoDBDocumentClient.from(client);

export default class DBService {
  create = async (params: any) => {
    try {
      return await documentClient.send(params);
    } catch (error) {
      throw new AppError(500, error.message);
    }
  };

  update = async (params: any) => {
    try {
      return await documentClient.send(params);
    } catch (error) {
      throw new AppError(500, error.message);
    }
  };

  query = async (params: any) => {
    try {
      return await documentClient.send(params);
    } catch (error) {
      throw new AppError(500, error.message);
    }
  };

  get = async (params: any) => {
    try {
      return await documentClient.send(params);
    } catch (error) {
      throw new AppError(500, error.message);
    }
  };

  delete = async (params: any) => {
    try {
      return await documentClient.send(params);
    } catch (error) {
      throw new AppError(500, error.message);
    }
  };
}
