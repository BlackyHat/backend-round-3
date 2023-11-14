import { LinkLifetime } from '@/models/link.model';

export default {
  type: 'object',
  properties: {
    link: { type: 'string' },
    lifetime: { type: 'string', enum: Object.values(LinkLifetime) },
  },
  required: ['link', 'lifetime'],
} as const;
