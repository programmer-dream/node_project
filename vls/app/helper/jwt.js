const expressJwt = require('express-jwt');
const config = require("../../../config/env.js");
const authController = require("../controllers/auth.controller");

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked, algorithms: ['RS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/auth/signin',
            '/auth/signup',
            '/auth/userId',
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await authController.getById(payload.userId);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};