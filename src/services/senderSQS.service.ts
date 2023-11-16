import { ILink } from '@/models/link.model';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient } from '@/libs/sqsClient';

interface ILinkData extends ILink {
  email: string;
}

export const addQueueExpiredLinks = async (linkData: ILinkData) => {
  const command = new SendMessageCommand({
    MessageBody: JSON.stringify(linkData),
    QueueUrl: process.env.SQS_QUEUE_URL,
  });

  try {
    await sqsClient.send(command);
    console.log(`Event added successfully to Queue`);
  } catch (error) {
    console.error(`Error add email to queue`);
  }
};
