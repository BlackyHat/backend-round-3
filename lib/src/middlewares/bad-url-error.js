module.exports = (req, res, next) => {
    res
        .status(404)
        .json({ status: 'false', error: 'Oops! Resource not found...' });
};
//# sourceMappingURL=bad-url-error.js.map