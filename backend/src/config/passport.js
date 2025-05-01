const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('../models');
const logger = require('../utils/logger');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(options, async (jwtPayload, done) => {
            try {
                // Find the user by id from the JWT payload
                const user = await User.findByPk(jwtPayload.id, {
                    attributes: { exclude: ['password'] },
                });

                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (error) {
                logger.error('Error authenticating user:', error);
                return done(error, false);
            }
        })
    );
};