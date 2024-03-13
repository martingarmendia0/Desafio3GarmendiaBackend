// passport.config.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('./db');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Buscar el usuario por email en la base de datos
        const user = await User.findOne({ email });

        // Si el usuario no existe o la contraseña es incorrecta, retornar un mensaje de error
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: 'Credenciales inválidas' });
        }

        // Si el usuario y la contraseña son válidos, retornar el usuario
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    // Lógica para autenticar con GitHub
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Buscar el usuario por ID en la base de datos
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;