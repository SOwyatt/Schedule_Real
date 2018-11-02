var mySQL = require("mysql");

var pool = mySQL.createPool({ //Create connection
    connectionLimit : 15,
    host : "localhost",
    database : "testdb1",
    user : "root",
    password : "F9vZ6!7)nF2)Gru" 
});

function parse(obj, callback) {
    /** Parses an sql query. 
     * @arg callback : A callback function, will be passed the data
     * @arg obj.sql : an sql query
     * @arg obj.replace_ : A list of replacements for ?s in sql
     * @arg obj.result : a boolean indicating whether a result should be returned
     */

     //Assign meaningfull values
     obj.replace_ = obj.replace_ || [];
     callback = callback || function() {};

    //Connect and pass the sql command to the server
    pool.query(obj.sql, obj.replace_, function(err, data) {
        if(err) { //Pass the err to the callback if there is an err
            callback(err, null);
            throw err;
        }
        else if(obj.result) { // Pass the data to the callback if result is true
            callback(null, data)
        }
        // If the result isn't needed and there's no error, call the callback with no args
        else callback();
        });
}

module.exports = {
    parse : parse
};