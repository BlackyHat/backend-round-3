export default {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      minLength: 8,
      maxLength: 48,
    },
    password: { type: 'string', minLength: 8, maxLength: 48 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
} as const;
