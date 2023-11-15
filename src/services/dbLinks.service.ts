import { ILink, LinkLifetime } from '@/models/link.model';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { addQueueExpiredLinks } from './senderSQS.service';
import { findByID } from './dbUsers.service';

const { LINKS_TABLE, IS_OFFLINE } = process.env;
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
const docClient = DynamoDBDocumentClient.from(client);

async function createUserLink(linkData: ILink) {
  const command = new PutCommand({
    TableName: String(LINKS_TABLE),
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
    TableName: String(LINKS_TABLE),
    Key: { id: linkId, userId },
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
    await addQueueExpiredLinks(
      JSON.stringify({ email: user.email, ...linkData })
    );
    return linkData;
  } catch (error) {
    throw new Error(error.message || 'Error to deactivate link');
  }
}

async function getUserLinksList(userId: string) {
  const query = new QueryCommand({
    TableName: String(LINKS_TABLE),
    IndexName: 'userId_idx',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
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

async function getOriginLink(shortLink: string) {
  const query = new QueryCommand({
    TableName: String(LINKS_TABLE),
    IndexName: 'shortLink_idx',
    KeyConditionExpression: 'shortLink = :shortLink',
    ExpressionAttributeValues: {
      ':shortLink': shortLink,
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

    if (linkData.expiredAt === LinkLifetime.ONE_TIME) {
      //TODO::add deactivate +1 count conditions;
      await deactivateUserLink(linkData.userId, linkData.id);
    } else {
      await updateLinkVisit(linkData.userId, linkData.id);
    }
    return linkData;
  } catch (error) {
    throw new Error(error.message || 'Error getting original link');
  }
}

async function updateLinkVisit(userId: string, linkId: string) {
  const command = new UpdateCommand({
    TableName: String(LINKS_TABLE),
    Key: { id: linkId, userId },
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
      throw new Error(`No link with id:${linkId} finded`);
    }
    return result.Attributes;
  } catch (error) {
    throw new Error(error.message || 'Error creating new link');
  }
}

async function deactivateExpiredLinks() {
  const currentTime = Date.now();
  const scanCommand = new ScanCommand({
    TableName: String(LINKS_TABLE),
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
      console.log('No links to update.');
      return;
    }
    await Promise.all(
      expiredLinks.map(({ id, userId }) => {
        deactivateUserLink(userId, id);
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
