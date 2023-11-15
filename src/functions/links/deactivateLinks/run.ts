import { deactivateExpiredLinks } from '@/services';

export const deactivateLinks = async () => {
  await deactivateExpiredLinks();
};
