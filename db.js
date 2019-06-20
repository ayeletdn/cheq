const mysql = require('mysql');

module.exports = class Database {
    constructor() {
        this.con;
        this.isConnected = false;
    }

    /* On Workbench ran command:
    ALTER USER 'yaelet' IDENTIFIED WITH mysql_native_password BY 'devyaelet';
    flush privileges;
    */

    connect() {
        try {
            this.con = mysql.createConnection({
                host: 'localhost',
                user: 'yaelet',
                password: 'devyaelet',
                database: 'combotag'
            });
            this.isConnected = true;
            console.log('DB Connected');
        } catch (e) {
            console.log("Failed to open connection to DB: " + e);
        }

        return this.isConnected;
    }

    disconnect() {
        if (this.isConnected) {
            try {
                this.con.end();
                this.isConnected = false;
                console.log('DB Closed');
            } catch (e) {
                console.log("Failed to close connection to DB: " + e);
            }
        }

        return this.isConnected;
    }

    get(table) {
        if (!this.isConnected) {
            return Promise.reject(new Error("DB is not conected"));
        }

        // TODO: replate LIMIT with proper pagination
        const query = 'Select * FROM ' + table + ' LIMIT 1000';
        return this.queryPromise(query);
    }

    delete(table, id) {
        if (!this.isConnected) {
            return Promise.reject(new Error("DB is not conected"));
        }

        const query = 'DELETE FROM ' + table + ' WHERE id = ?'
        return this.queryPromise(query, [id]);
    }

    post(table, row) {
        if (!this.isConnected) {
            return Promise.reject(new Error("DB is not conected"));
        }

        const query = 'INSERT INTO ' + table + ' SET ?'
        return new Promise((resolve, reject) => {
            this.con.query(query, row, (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });
    }

    put(table, id, rowObj) {
        if (!this.isConnected) {
            return Promise.reject(new Error("DB is not conected"));
        }

        delete rowObj['id'];
        const columns = Object.keys(rowObj);
        
        // Make sure all column names are valid, 
        // to protect against injection
        const invalidColumnName = columns.find(c => c.search(/[^A-Za-z$_\d]/) > -1);
        if (invalidColumnName) {
            return Promise.reject("Invalid column name: " + invalidColumnName);
        }

        const values = Object.values(rowObj).concat([id]);
        const query = 'UPDATE ' + table + ' SET ' 
                        + columns.map(c => c + ' = ?').join(', ') 
                        + ' WHERE id = ?';
        return this.queryPromise(query, values);

    }


    queryPromise(query, values) {
        const queryObj = {sql: query};
        if (values) {
            Object.assign(queryObj, {values: values});
        }
        return new Promise((resolve, reject) => {
            this.con.query(queryObj, (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });
    }

}