const express = require('express');
const router = express.Router()
const Database = require('./db.js');

// TODO:handle connection closing
// Tried process.on('SIGTERM'), process.on('exit')
const db = new Database();
db.connect();

const PATH_TO_TABLE = {'vasts': 'vasts', 'keywords': 'keywordlists'};
// Identify the correct table the request is for
// and set it on the req object.
const setTableOnRequest = (req, res, next) => {
    path = req.originalUrl;
    if (path.indexOf('/') !== path.lastIndexOf('/')) {
        path = path.substring(1, path.indexOf('/',1));
    } else {
        path = path.substring(1);
    }
    req.table = PATH_TO_TABLE[path];
    next();
}

router.use(setTableOnRequest);

// TODO: Bad habbit to send the error message to the client
router.get("/", async function(req, res) {
    try {
      const data = await db.get(req.table);
      res.end(JSON.stringify(data));
    } catch (e) {
      console.error(e);
      res.status(500).end(e.message);
    }
});

router.post("/", async function(req, res) {
    if (!req.body || !Object.keys(req.body).length) {
        res.status(403).end("Invalid request body: " + req.body);
        return;  
    }

    try {
        form = req.body;
        const data = await db.post(req.table, form);
        Object.assign(form, {id: data.insertId})
        res.end(JSON.stringify(form));
    } catch (e) {
        console.error(e);
        res.status(500).end(e.message);  
    }
});

router.put("/:id", async function(req, res) {
    if (!req.table || !req.params.id || !req.body || !Object.keys(req.body).length) {
        res.status(403).end("Invalid request data: " + {
            table: req.table,
            id: req.params.id,
            body: req.body
        });
        return;  
    }

    try {
        await db.put(req.table, req.params.id, req.body);
        res.end(JSON.stringify(req.body));
    } catch (e) {
        console.error(e);
        res.status(500).end(e.message);
    }
});

router.delete("/:id", async function(req, res) {
    if (!req.table || !req.params.id) {
        console.log(req.table);
        console.log(req.params.id);
        res.status(403).end("Missing table name or entity id");
        return;
    }

    try {
      await db.delete(req.table, req.params.id);
      res.end(JSON.stringify(req.params.id));
    } catch (e) {
      console.error(e);
      res.status(500).end(e.message);
    }
});

module.exports = router;
