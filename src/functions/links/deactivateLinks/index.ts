import { handlerPath } from '@/libs/handler-resolver';
export default {
  handler: `${handlerPath(__dirname)}/run.deactivateLinks`,
  events: [
    {
      eventBridge: {
        name: 'deactivate-expired-links',
        description: 'Cron task for deactivate expired links',
        schedule: 'cron(0 3 * * ? *)',
        timeZone: 'Europe/Kyiv',
        enabled: true,
      },
    },
  ],
};
