module.exports = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ status: 'false', error: err.message });
};
//# sourceMappingURL=error-handler.js.map