const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');

module.exports = (passport) => {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.JWT_SECRET || 'your_jwt_secret';

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // NOTE: placeholder - in a real app you'd look up the user in the DB
        return done(null, jwt_payload);
    }));
};
