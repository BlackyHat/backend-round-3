import express from 'express';
const { authRouter } = require('./routes');
// const { authRouter, userRouter } = require('./routes');

const app = express();

app.use(express.json());
app.use('/auth', authRouter);
// app.use('/me', userRouter);
app.get('/hello', (_req, res, _next) => {
  return res.status(200).json({
    message: 'Hello, World!',
  });
});

export { app };
