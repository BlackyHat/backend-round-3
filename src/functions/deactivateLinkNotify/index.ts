import { handlerPath } from '@/libs/handler-resolver';
export default {
  handler: `${handlerPath(__dirname)}/handler.deactivateLinkNotify`,
  events: [
    {
      sqs: {
        arn: {
          'Fn::GetAtt': ['EmailSQSQueue', 'Arn'],
        },
        batchSize: 10,
      },
    },
  ],
};
