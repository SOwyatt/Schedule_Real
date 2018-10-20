var mySQL = require("mysql");

var con = mySQL.createConnection({ //Create connection
    host : "localhost",
    databse : "testdb1",
    username : "root",
    password : "F9vZ6!7)nF2)Gru" 
});

module.exports = {
    con : con,
    fetchEmployee : fetchEmployee
};