import express from 'express';
import serverless from 'serverless-http';
const { authRouter, userRouter } = require('./routes');
const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/me', userRouter);
app.use((err, req, res, next) => {
    res.status(err.status || 500).send();
});
export const handler = serverless(app);
//# sourceMappingURL=app.js.map