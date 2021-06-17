const knexFile = require('../knexfile').development;
const knex = require('knex')(knexFile);
const hash = require("./hash");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use('local-signup', new LocalStrategy(
    {passReqToCallback: true},
    async (req, username, password, done) => {
        console.log(req)
        try {
            let email = req.body.email
            let user = await knex.select("*").from("users").where("name", username).orWhere("email", email)
            if (user.length > 0) {
                return done(null, false, {
                    message: 'user already exists'
                })
            }
            let hashpassword = await hash.hash(password)
            let newUser = {
                name: username,
                email: email,
                hash: hashpassword
            }
            let userID = await knex.insert(newUser).into("users").returning("id");
            newUser.id = userID[0]
            return done(null, newUser)
        } catch (error) {
            console.log(error);
        }
    }
))

module.exports = passport