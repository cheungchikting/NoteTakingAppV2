const knexFile = require('../knexfile').development;
const knex = require('knex')(knexFile);
const hash = require("./hash");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use('local-login', new LocalStrategy(
    async (username, password, done) => {
        try {
            let user = await knex.select("*").from("users").where("name", username).orWhere("email", username)
            if (user.length == 0) {
                return done(null, false, {
                    message: 'username does not exists'
                })
            }
            let result = await hash.checkpassword(password, user[0].hash)
            if (result) {
                return done(null, user[0])
            } else {
                return done(null, false, {
                    message: "incorrect credentials",
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
))

module.exports = passport