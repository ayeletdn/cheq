// const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
// const process = require('process');
const router = require('./modules/router.js');

const app = express();

// path to get material design files
app.use('/mdl', express.static(path.join(__dirname, 'node_modules/material-design-lite')));


// parse application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// echo
app.get('/echo', function (req, res) {
  // merge get and post
  const out = Object.assign({}, req.query, req.params);
  res.setHeader('Content-Type', 'application/json');
  // res.write('you posted:\n')
  res.end(JSON.stringify(out, null, 2));
});

// Router behaviour is the same for both paths,
// excluding table
app.use('/vasts', router);
app.use('/keywords', router);

app.listen(3001);