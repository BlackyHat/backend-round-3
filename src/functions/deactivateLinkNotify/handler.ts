import { SQSEvent } from 'aws-lambda';
import { SendEmailCommand } from '@aws-sdk/client-ses';

import { sesClient } from '@/libs/sesClient';

export const deactivateLinkNotify = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const linkData = JSON.parse(record.body);

    const command = new SendEmailCommand({
      Source: process.env.EMAIL_SENDER,
      Destination: {
        ToAddresses: [linkData.email],
      },
      Message: {
        Subject: {
          Data: 'Link lifetime expired',
        },
        Body: {
          Text: {
            Data: `Notification: the short link for URL: ${linkData.originalLink}, lifetime expired. Total  visitors by link: ${linkData.visited}`,
            Charset: 'UTF-8',
          },
        },
      },
    });

    try {
      return await sesClient.send(command);
      //TODO:
    } catch (error) {
      console.error(`Error sending email: ${error}`);
    }
  }
};
