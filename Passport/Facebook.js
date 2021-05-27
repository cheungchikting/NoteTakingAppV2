const knexFile = require('../knexfile').development;
const knex = require('knex')(knexFile);
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

require("dotenv").config()

passport.use('facebook', new FacebookStrategy({
  clientID: process.env.AppId,
  clientSecret: process.env.AppSecret,
  callbackURL: "http://localhost:8000/auth/facebook/callback",
  profileFields: ['email', 'displayName']

}, function (accessToken, refreshToken, profile, done) {

  knex('users').where('facebookid', profile.id).then((data) => {
    if (data == 0) {
      let user = {
        name: profile.displayName,
        email: profile.emails[0].value,
        facebookid: profile.id,
        accessToken: accessToken,
      }
      return knex('users').insert(user).returning('id').then((id)=>{
        user.id = id[0]
        done(null,user)
      })
    }
    done(null, data[0])
  })
}))

module.exports = passport