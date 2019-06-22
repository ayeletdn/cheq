const bcrypt = require('bcrypt');
const Database = require('./db.js');

// TODO:handle connection closing
// Tried process.on('SIGTERM'), process.on('exit')
const db = new Database();
db.connect();

module.exports = class User {

    constructor() {
        this.id;
        this.username;
        this.email;
        this.isLoggedIn = false;
    }

    async register(username, email, password) {
        try {
            const result = await db.getOne('users', 'username', username);
            if (result && Array.isArray(result) && result.length > 0) {
                // failing to register due to user exists.
                return false;
            }
        } catch (e) {
            throw new Error('Failed to verify username exists: ' + e.message);
        }

        const salt = bcrypt.genSaltSync();
        let user;
        try {
            user = {
                email,
                username,
                password: await bcrypt.hash(password, salt)
            };  
        } catch (e) {
            throw new Error('Failed to hash password: ' + e.message);
        }

        try {
            const result = await db.post('users', user);
            this.id = result.insertId;
            this.username = username;
            this.email = email;
            return true;
        } catch (e) {
            throw new Error('Failed to register user: ' + e.message);
        }
    }

    async login(username, password) {
        let result;
        try {
            result = await db.getOne('users', 'username', username);
            if (!result || !Array.isArray(result) || result.length === 0) {
                // failing to register due to user exists.
                return false;
            }
        } catch (e) {
            throw new Error('Failed to verify username exists: ' + e.message);
        }

        try {
            // if user was found return status of password matching
            return this.isLoggedIn = await bcrypt.compare(password, result[0].password);
        } catch (e) {
            throw new Error('Passowrd check failed: ' + e.message);
        }
    }


}