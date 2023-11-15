import { SQSEvent } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export const deactivateLinkNotify = async (event: SQSEvent): Promise<void> => {
  const clientSES = new SESClient({});

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    console.log('Received message:', messageBody);

    const command = new SendEmailCommand({
      Source: process.env.EMAIL_SENDER,
      Destination: {
        ToAddresses: [messageBody.recipient],
      },
      Message: {
        Subject: {
          Data: 'Link lifetime expired',
        },
        Body: {
          Text: {
            Data: `Notification: the short link for URL: ${messageBody.originalLink}, lifetime expired. Total  visitors by link: ${messageBody.visited}`,
          },
        },
      },
    });

    try {
      await clientSES.send(command);
      console.log(`Email sent successfully to ${messageBody.recipient}`);
    } catch (error) {
      console.error(`Error sending email: ${error.message}`);
    }
  }
};
