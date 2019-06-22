// const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
var cookieParser = require('cookie-parser');
const session = require('express-session');
// const process = require('process');
const router = require('./modules/router.js');
const auth = require('./modules/authRouter.js');
const app = express();

// path to get material design files
app.use('/mdl', express.static(path.join(__dirname, 'node_modules/material-design-lite')));


// parse application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// easy cookie access
app.use(cookieParser());


app.use(session({
  secret: 'whattimeshouldistartmyfirstdayatcheqai',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

/***************
 * USER / SESSION Management
 ***************/
// This middleware will check if user's cookie is still saved in browser
// and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, 
// your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

app.use('/auth', auth);

/***************
 * Data Management
 ***************/
// Router behaviour is the same for both paths,
// excluding table
app.use('/vasts', router);
app.use('/keywords', router);


app.listen(3001);