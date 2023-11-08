import * as express from 'express';

export default ((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({ status: 'false', error: err.message });
}) as express.ErrorRequestHandler;
