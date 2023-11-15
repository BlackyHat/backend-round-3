import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export const addQueueExpiredLinks = async (body: string) => {
  const clientSQS = new SQSClient({});

  const command = new SendMessageCommand({
    MessageBody: JSON.stringify(body),
    QueueUrl: process.env.SQS_QUEUE_URL,
  });
  try {
    await clientSQS.send(command);
    console.log(`Event added successfully to Queue`);
  } catch (error) {
    console.error(`Error add email to queue`);
  }
};
