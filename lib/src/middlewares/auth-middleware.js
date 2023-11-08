const jwt = require('jsonwebtoken');
const db = require('../db');
const { NotAuthorizedError } = require('../utils/app-errors');
const { JWT_SECRET } = process.env;
const authMiddleware = async (req, _, next) => {
    const { authorization = '' } = req.headers;
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer' || !token) {
        next(new NotAuthorizedError(`Not authorized.`));
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await db.findById(id);
        if (!user ||
            (token !== user.access_token && token !== user.refresh_token)) {
            next(new NotAuthorizedError('Not authorized.'));
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new NotAuthorizedError(error.message));
    }
};
module.exports = { authMiddleware };
//# sourceMappingURL=auth-middleware.js.map