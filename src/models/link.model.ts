export enum LinkLifetime {
  ONE_TIME = 'one time',
  ONE_DAY = '1 day',
  THREE_DAYS = '3 days',
  SEVEN_DAYS = '7 days',
}

export interface ILink {
  id: string;
  userId: string;
  shortLink: string;
  originalLink: string;
  isActive: boolean;
  createdAt: number;
  lifetime: LinkLifetime;
  visited: number;
}
