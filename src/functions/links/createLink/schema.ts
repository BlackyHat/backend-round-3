import { LinkLifetime } from '@/models/link.model';

export default {
  type: 'object',
  properties: {
    link: {
      type: 'string',
      pattern: '^(https?):\\/\\/[\\w-]+(\\.[\\w-]+)+([/?#].*)?$',
    },
    lifetime: { type: 'string', enum: Object.values(LinkLifetime) },
  },
  required: ['link', 'lifetime'],
  additionalProperties: false,
} as const;
