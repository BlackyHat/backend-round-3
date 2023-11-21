import {
  PutCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

import { docClient } from '@/libs/dynamoDBClient';
import { ILink, LinkLifetime } from '@/models/link.model';
import { addQueueExpiredLinks } from './senderSQS.service';
import { findByID } from './dbUsers.service';

const TABLE = String(process.env.TABLE_NAME);

const createLinkPK = (id: string) => 'UL#'.concat(id);
const createLinkSK = (id: string) => 'LINK#'.concat(id);

async function createUserLink(linkData: ILink) {
  const command = new PutCommand({
    TableName: TABLE,
    Item: linkData,
  });

  try {
    const result = await docClient.send(command);
    return result.Attributes as ILink;
  } catch (error) {
    throw new Error(error.message || 'Error creating new link');
  }
}

async function deactivateUserLink(userId: string, linkId: string) {
  const command = new UpdateCommand({
    TableName: TABLE,
    Key: { PK: createLinkPK(userId), SK: createLinkSK(linkId) },
    UpdateExpression: 'SET #isActive = :isActive',
    ExpressionAttributeNames: {
      '#isActive': 'isActive',
    },
    ExpressionAttributeValues: {
      ':isActive': false,
    },

    ReturnValues: 'ALL_NEW',
  });

  try {
    const result = await docClient.send(command);
    if (!result.Attributes) {
      throw new Error(`No link with id:${linkId} finded`);
    }
    const linkData = result.Attributes as ILink;
    const user = await findByID(userId);
    await addQueueExpiredLinks({ email: user.email, ...linkData });

    return linkData;
  } catch (error) {
    throw new Error(error.message || 'Error to deactivate link');
  }
}

async function getUserLinksList(userId: string) {
  const query = new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: 'PK=:pk',
    ExpressionAttributeValues: { ':pk': createLinkPK(userId) },
  });

  try {
    const { Items } = await docClient.send(query);
    if (!Array.isArray(Items)) {
      throw new Error('Could not retreive list link');
    }
    return Items as ILink[];
  } catch (error) {
    throw new Error(error.message || 'Error get user links list');
  }
}

async function getOriginLink(index: string) {
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
      throw new Error('Could not retreive original link');
    }
    const linkData: ILink = Items[0] as ILink;
    if (!linkData.isActive) {
      throw new Error('The link in no longer active');
    }
    await updateLinkVisit(linkData.userId, linkData.linkId);
    if (linkData.expiredAt === LinkLifetime.ONE_TIME) {
      await deactivateUserLink(linkData.userId, linkData.linkId);
    }
    return linkData;
  } catch (error) {
    throw new Error(error.message || 'Error getting original link');
  }
}

async function updateLinkVisit(userId: string, linkId: string) {
  const command = new UpdateCommand({
    TableName: TABLE,
    Key: { PK: createLinkPK(userId), SK: createLinkSK(linkId) },
    UpdateExpression: 'SET #visited = #visited + :incrementValue',
    ExpressionAttributeNames: {
      '#visited': 'visited',
    },
    ExpressionAttributeValues: {
      ':incrementValue': 1,
    },
    ReturnValues: 'ALL_NEW',
  });
  try {
    const result = await docClient.send(command);
    if (!result.Attributes) {
      throw new Error(`No link founded`);
    }
    return result.Attributes;
  } catch (error) {
    throw new Error(error.message || 'Error create new link');
  }
}

async function deactivateExpiredLinks() {
  const currentTime = Date.now();
  const scanCommand = new ScanCommand({
    TableName: TABLE,
    FilterExpression:
      'expiredAt < :currentTime AND isActive = :isActive AND lifetime <> :lifetimeOnce',
    ExpressionAttributeValues: {
      ':currentTime': currentTime,
      ':isActive': true,
      ':lifetimeOnce': LinkLifetime.ONE_TIME,
    },
  });
  try {
    const result = await docClient.send(scanCommand);
    const expiredLinks: ILink[] = result.Items as ILink[];
    if (expiredLinks.length === 0) {
      return;
    }
    await Promise.all(
      expiredLinks.map(({ userId, linkId }) => {
        deactivateUserLink(userId, linkId);
      })
    );
    console.log(`All expired links deactivated.`);
  } catch (error) {
    throw new Error(error.message || 'Error deactivate expired links');
  }
}

export {
  createUserLink,
  deactivateUserLink,
  getUserLinksList,
  getOriginLink,
  deactivateExpiredLinks,
};
