const express = require("express")
const expressFileUpload = require("express-fileupload")
const session = require("express-session");
const methodOverride = require('method-override')

const app = express();
app.use(expressFileUpload())
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(methodOverride('_method'))
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

const knexFile = require('./knexfile').development;
const knex = require('knex')(knexFile);
const Method = require("./Method")
const Router = require("./Router")
const method = new Method(knex)
const router = new Router(method)

const serializeUser = require("./Passport/Cookie").serializeUser;
const deserializeUser = require("./Passport/Cookie").deserializeUser;
const passport = require('passport');

const signup = require("./Passport/SignUp")
const login = require("./Passport/Login")
const facebook = require('./Passport/Facebook');
const google = require('./Passport/Google');
app.use(signup.initialize());
app.use(signup.session());
app.use(login.initialize());
app.use(login.session());
app.use(facebook.initialize());
app.use(facebook.session());
app.use(google.initialize());
app.use(google.session());

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);


const hb = require('express-handlebars');
app.engine('handlebars', hb({
    defaultLayout: 'main',
    helpers: {
        math: function (lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
            } [operator];
        }
    }
}));
app.set('view engine', 'handlebars');
const hbs = hb.create({});

hbs.handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a == b) {
        return options.fn(this);
    }
    return options.inverse(this);
});



app.use("/", router.router())


app.post('/login', login.authenticate('local-login', {
    successRedirect: '/home',
    failureRedirect: '/err'
}));

app.post('/signup', signup.authenticate('local-signup', {
    successRedirect: '/home',
    failureRedirect: '/err',
}));

app.get("/auth/facebook", passport.authenticate("facebook", {
    scope: "email"
}));
app.get("/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/home",
    failureRedirect: "/err"
}));

app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email']
}));
app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/err'
    }),
    function (req, res) {
        res.redirect('/home');
    });


app.listen(8000, () => {
    console.log("Application started at port:8000");
});