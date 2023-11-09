import express from 'express';
import { authRouter } from './routes';
import badUrlError from './middlewares/bad-url-error';
import errorHandler from './middlewares/error-handler';
const app = express();

app.use(express.json());
app.use('/auth', authRouter);
app.all('*', badUrlError);
app.use(errorHandler);

export { app };
