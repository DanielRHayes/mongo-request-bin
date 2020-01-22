'use strict';
const config = require('./config');

function requirePassword(req, res, next) {
    if (!req.body.password) {
        const err = new Error('password is required');
        console.error(err);
        return next(err);
    }
    const password = req.body.password;
    if (password !== config.password) {
        const err = new Error('password is incorrect');
        console.error(err);
        return next(err);
    }
    return next();
}

module.exports = {
    requirePassword
};