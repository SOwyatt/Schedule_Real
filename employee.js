var SQL = require('./sql.js');

function Employee(obj) {
    /** Defines the Employee class
     * @arg obj.id : an integer; the employee's id
     * @arg obj.name : A string; the employee's name
     * @arg obj.position : A string; the employee's positions split by commas
     */

    this.id = obj.id;
    this.name = obj.name;
    this.position = obj.position;

    this.save = function() {
        SQL.parse({
            sql : `UPDATE EMPLOYEES
                SET id=?, name=?, position=?
                WHERE id=?;`,
                replace_ : [this.id, this.name, this.position, this.id],
                result : false
            }
        );
        console.log("Saved!");
    }
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
         // Pass the employee to the callback as an employee object if there's no errors
         callback(null, new Employee({ // data is passed as a list from the sql table, so take only the object we need through [0]
                id : data[0].id,
                name : data[0].name,
                position : data[0].position
            })
         );
     });
}

fetchEmployee(985, function(err, data) {
    if(err) throw err;
    console.log(data);
    data.save();
});


module.exports = {
    Employee : Employee,
    fetchEmployee : fetchEmployee
}