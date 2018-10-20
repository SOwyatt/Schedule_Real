var SQL = require('./sql.js');

function Employee(obj) {
    //obj should be an object with id, name, and a schedule object
    this.id = obj.id;
    this.name = obj.name;
    this.schedule = obj.schedule;

    this.exists = function() { // Detects if the employee is saved already
        SQL.con.query("SELECT id FROM employees WHERE id=?", [this.id], function(err) {

        });

        this.save = function() {

        }
    }
}

function fetchEmployee(id) { //Fetch an employee from the employee table
    con.query("SELECT * FROM employees WHERE id=?", [id], function(err, results, fields) {
        if (err) {
            console.error(err);
            throw err;
        }
        return results;
    });
}

function test() {
    SQL.con.query("SELECT IF(COUNT(*) > 0, 'OK', 'Failed' as STATUS FROM employees WHERE id=2", function(err, results, fields) {
        return results;
    });
}

module.exports = {
    test : test
}