import { deactivateExpiredLinks } from '@/services';

export const deactivateLinkSchedule = async () => {
  await deactivateExpiredLinks();
};
