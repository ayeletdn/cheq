const express = require('express');
const router = express.Router()

const User = require('./user.js');


router.post('/login', async (req, res) => {
    const user = new User();
    try {
        const success = await user.login(req.body.username, req.body.password);
        if (success) {
            req.session.user = user;
            res.end();
        } else {
            res.status(403).end('Invalid username or password');
        }
    } catch (e) {
        console.log(e);
        res.status(500).end("Something unpleasant happened. Please move on, nothing to see here.");
    }
});

router.post('/register', async (req, res) => {
    let user = new User();
    try {
        const success = await user.register(req.body.username, req.body.email, req.body.password);
        if (success) {
            res.end()
        } else {
            res.status(403).end('Invalid username');
        }
    } catch (e) {
        console.log(e);
        res.status(500).end("Something unpleasant happened. Please move on, nothing to see here.");
    }
});
  
router.get('/isLoggedIn', (req, res) => { 
    res.send(Boolean(req.session.user));
});

module.exports = router;