const express = require("express")
const Enmap = require('enmap');
const dbg = new Enmap({ name: 'Panel' });
const passport = require('passport');
const session = require('express-session');
const ghost = require("./ghost-config.json")


const MemoryStore = require('memorystore')(session);
const Strategy = require('passport-discord').Strategy;
const url = require('url');
const helmet = require('helmet');
const { EvaluatedPermissions } = require('discord.js');

var app = express();


var fs = require("fs")

app.use(express.static("./")); 
const https = require('https');
app.set("view engine", "ejs","handlebars"); 
const Discord = require("discord.js")
const client = new Discord.Client();
app.listen(8000)


client.on("ready", () => {
	console.log("site ve bot hazır")
})

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((obj, done) => {
	done(null, obj);
});

passport.use(new Strategy({
	clientID: ghost.botıd,
	clientSecret: ghost.botsecret,
	callbackURL: ghost.domaınauth, 
	scope: ['identify', 'guilds'] 
},
(accessToken, refreshToken, profile, done) => {
	process.nextTick(() => done(null, profile));
}));
app.use(session({
	store: new MemoryStore({
		checkPeriod: 86400000
	}),
	secret: 'qwerz', 
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.locals.domain = 'domain'; // local host
const bodyParser = require('body-parser');
const { Console } = require("console");
app.use(bodyParser.json());

function checkAuth(req, res, next) {
	if (req.isAuthenticated()) return next();
	req.session.backURL = req.url;
	res.redirect('/login');
}

app.get('/login', (req, res, next) => {
	if (req.session.backURL) {
		req.session.backURL = 'domain/auth';
	} else if (req.headers.referer) {
		const parsed = url.parse(req.headers.referer);
		if (parsed.hostname === app.locals.domain) {
			req.session.backURL = parsed.path;
		}
	} else {
		req.session.backURL = '/';
	}
	next();
},

passport.authenticate('discord'));
app.get('/auth', passport.authenticate('discord', {
	failureRedirect: '/'
}), (req, res) => {
	if (req.session.backURL) {
		const refurl = req.session.backURL;
		req.session.backURL = null;
		res.redirect(refurl);
	} else {
		res.redirect('/');
	}
});

app.get("/logout", function(req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/"); 
    });
  });
  
	

app.get('/magaza', function(req, res) {
  let user = req.user;
  if(user) {
    res.render("magaza", { 
      bot: client,
      member: req.user,
    });
  }
})

  app.get('/', function(req, res) {
  res.render("./index", { 
    bot: client.user,
    user: client,
    member: req.user,
  });
});
  

client.login(ghost.token)

