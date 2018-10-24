var SQL = require('./sql.js');

function Employee(obj) {
    /** Defines the Employee class
     * @arg obj.id : an integer; the employee's id
     * @arg obj.name : A string; the employee's name
     * @arg obj.position : A string; the employee's positions split by commas
     * @arg obj.email : A string, the employee's email
     */

    this.id = obj.id;
    this.name = obj.name;
    this.position = obj.position;
    this.email = obj.email;

    this.save = function() {
        /** Saves the employee in an sql database checks if
         *  the employee exists to decide whether to save in
         * a new row or an existing row before saving.
         */

        //After this point this will be out of scope
        var id = this.id;
        var name = this.name;
        var position = this.position;
        var email = this.email;

        this.exists(function(err, data) {
            if(err) throw err;
            if(data) { // If the user already exists, save it as normal
                SQL.parse({
                    sql : `UPDATE EMPLOYEES
                        SET id=?, name=?, position=?, email=?
                        WHERE id=?;`, // SQL to update an existing employee
                        replace_ : [id, name, position, email, id],
                        result : false
                    }
                );
            }   
            else {
                SQL.parse({ // If the employee doesn't exist, create a new entry
                    sql : `INSERT INTO employees
                    VALUES (?, ?, ?, ?)`, // SQL to create a new employee
                    replace_ : [id, name, position, email],
                    result : false
                    }
                );
            }
        });
    };

    this.exists = function(callback) {
        /** Checks if the employee is already saved inside a row of the sql table */

        SQL.parse({
            sql : "SELECT id FROM employees WHERE id=?",
            replace_ : [this.id],
            result : true
        },
        function(err, data) { // Pass errors as usual
            if(err) {
                callback(err, null);
                throw err;
            }
            //If there's no error, callback with whether or not it exists
            callback (null, data.length !== 0);
        });
    };
}

function fetchEmployee(id, callback) {
    /** Fetch an employee from the employee table
     * @arg id : An integer; the id of the employee to fetch
     * @arg callback : A callback function to pass the employee to
     */
    
    SQL.parse({ // Perform the parse, define the sql, replace, and result
        sql : "SELECT * FROM employees WHERE id=?;",
        replace_ : [id],
        result : true
    },

     function(err, data) {
        if(err) { // Pass an error if there's an error
             callback(err, null);
             throw err;
        }
         // If the employee exists
        callback(null, new Employee({ // data is passed as a list from the sql table, so take only the object we need through [0]
                id : data[0].id,
                name : data[0].name,
                position : data[0].position,
                email : data[0].email
            })
        );
    });
}

module.exports = {
    Employee : Employee,
    fetchEmployee : fetchEmployee
};