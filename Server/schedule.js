var SQL = require("./sql.js"),
    emp = require("./employee.js");

function ScheduleRequest(id, type, employee, date, position) {
    /** Constrctor for scheduleRequest 
     * @arg id : the request's id
     * @arg type : the type of request: an int between 0 and 1
     * @arg employee : an employee id
     * @arg date : The date of the request
     * @arg position : The position for which the request is
    */
    this.id = id;
    this.type = type;
    this.employee = employee;
    this.date = date;
    this.position = position;

    this.update = function() {
        /** Saves the request in an sql database checks if
         *  the request exists to decide whether to save in
         * a new row or an existing row before saving. */
 
        // This will be out of scope after this point
        var employee = this.employee,
            type = this.type,
            date = this.date,
            id = this.id;

        this.exists(function(err, data) {
            if(err) throw err;

            if(data) { // If it already exists
                SQL.parse({
                    sql : `UPDATE requests
                        SET r_id=?, e_id=?, r_type=?, date=?, position=?
                         WHERE r_id=?`,
                        replace_ : [id, employee.id, type, date, position, id], 
                        result : false
                    }
                );
            }
            else { // If it doesn't exist yet
                SQL.parse({ // If the employee doesn't exist, create a new entry
                    sql : `INSERT INTO requests
                        VALUES (?, ?, ?, ?, ?)`, // SQL to create a new employee
                        replace_ : [id, employee.id, type, date, position, id], 
                        result : false
                    }
                );
            }
        });
    };
    
    this.exists = function(callback) {
        /** Checks if the request is already saved inside a row of the sql table */

        SQL.parse({
            sql : "SELECT r_id FROM requests WHERE r_id=?",
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

module.exports = {
    ScheduleRequest : ScheduleRequest
};