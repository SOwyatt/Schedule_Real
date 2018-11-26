/**
 * Handles SQL queries & closeley related
 * 
 * @requires npm:mysql
 */

var mySQL = require("mysql");

var pool = mySQL.createPool({ //Create connection
    connectionLimit : 15,
    host : "localhost",
    database : "testdb1",
    user : "root",
    password : "F9vZ6!7)nF2)Gru" 
});

/**
 * Parses an sql query
 * @param {{sql : string replace_ : [string, [string], [string]] result : boolean}} obj 
 * @callback parseCallback
 */
function parse(obj, callback) {
     //Assign meaningfull values
     obj.replace_ = obj.replace_ || [];
     callback = callback || function() {};

    //Connect and pass the sql command to the server
    pool.query(obj.sql, obj.replace_, function(err, data) {
        
        if(err) {
            console.error(err);
            callback(err, null);
            throw err;
        }
        else if(obj.result) {
            callback(null, data)
        }
        // If the result isn't needed and there's no error, call the callback with no args
        else callback();
        });
}

module.exports = {
    parse : parse
};