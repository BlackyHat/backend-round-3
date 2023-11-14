export default {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      presence: {
        allowEmpty: false,
      },
    },
    password: {
      type: 'string',
      presence: {
        allowEmpty: false,
      },
    },
  },
  required: ['email', 'password'],
  message: 'required fields are missing',
  status: 'bad request',
} as const;
