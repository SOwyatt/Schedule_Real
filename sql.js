var mySQL = require("mysql");

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

    var con = mySQL.createConnection({ //Create connection
        host : "localhost",
        database : "testdb1",
        user : "root",
        password : "F9vZ6!7)nF2)Gru" 
    });

    con.connect(function(err) {
        if(err) throw err;

        //Connect and pass the sql command to the server
        con.query(obj.sql, obj.replace_, function(err, data) {
            if(err) { //Pass the err to the callback if there is an err
                callback(err, null);
                throw err;
            }
            else if(obj.result) { // Pass the data to the callback if result is true
                callback(null, data)
            }
            else callback();

            con.end(); // End the connection after all is done
        });
    });
}

module.exports = {
    parse : parse
};