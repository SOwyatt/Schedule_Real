/**
 * @fileoverview Defines the Employee class and related classes to it
 * 
 * TODO:  Make compile employees functions for position and department, as well as a compile positions for department
 * TODO:  Employee.fetchAll still doesn't work for positions if holding > 1
 * 
 * @author Travis Bergeron
 * @version 1.3.2
 * 
 * @requires ./sql.js
 */

var SQL = require("./sql.js");


class Employee {
    /**
     * Constructor
     * @param {number} id // employee's id
     * @param {string} name // employee's name
     * @param {[Position]} positions // a list of the employee's positions
     * @param {string} email // the employee's email
     * @param {{rating : number, conflictPriority : number}} stat // the stat object
     */
    constructor(id, name, positions, email, stat) {
        this.id = id;
        this.name = name;
        this.positions = positions;
        this.email = email;
        this.stat = stat || {
            rating: -1, 
            conflictPriority: 0.5
        }
    }

    /**
     * Fetches all employees from the SQL database
     * @callback fetchAllEmpCallback
     */
    static fetchAll(callback) {
        var result = [];

        Position.fetchAll(function(err, data) {
            if(err) { // Basic error handling
                console.error(err);
                callback(err, null);
                throw err;
            }

            var positions = data; // The list of all existing positions

            SQL.parse({
                sql : "SELECT * FROM employees",
                result : true
            }, function(err, data) {
                if(err) { // Basic error handling
                    console.error(err);
                    callback(err, null);
                    throw err;
                }

                var resultPos = [];
                console.log(data.length);
                for(var i = 0; i < data.length; i++) { // Loop through all the employees returned 
                    console
                    var positionsEmp = data[i].positions.split(","); // Position ids are saved split by a ','
                    console.log(data[i].name + positionsEmp);
                    // result.push(new Employee(data[i].id, data[i].name, resultPos, data[i].email, data[i].stat)); 
                    // Append this employee to the result list
                    resultPos = []; // Reset resultPos for the new employee
                }
                callback(null, result);
            });
        });
    }
}

class Position {
    /**
     * Constructor
     * @param {number} id // the position id (generally dept is x00, and position is xxx)
     * @param {Department} department // the department the position is part of
     * @param {string} title // the position title
     */
    constructor(id, department, title) {
        this.id = id;
        this.department = department;
        this.title = title;
    }

    /**
     * Fetches all positions from the SQL database
     * @callback fetchAllPositionsCallback
     */
    static fetchAll(callback) {
        var result = [];

        Department.fetchAll(function(err, data) {
            if(err) { // Basic error handling
                console.error(err);
                callback(null, err);
                throw err;
            }

            var departments = data; // Will be out of scope

            SQL.parse({
                sql : "SELECT * FROM positions",
                result : true
            }, function(err, data) {
                if(err) { // Basic error handling
                    console.error(err);
                    callback(err, null);
                    throw err;
                }
                for(var i = 0; i < data.length; i++) {
                    // Truncates the last two digits, turing 310 into 300 etc..
                    var dept = Math.floor(data[i].id / 100) * 100;

                    for(var j = 0; j < departments.length; j++) { // Loop through all departments until a match is found
                        if(dept === departments[j].id) {
                            dept = departments[j]; 
                            break; // Exit loop after department is found, preventing duplicates
                        }
                    }
                    result.push(new Position(data[i].id, dept, data[i].title));
                }
                callback(null, result)
            });
        });
    }
}

class Department {
    /**
     * Constructor
     * @param {number} id // the department id (usually in the form x00)
     * @param {string} title // the title of the department
     */
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }

    /**
     * Fetches all the departments from the SQL
     * @callback fetchAllDeptCallback
     */
    static fetchAll(callback) {
        var result = [];

        SQL.parse({
            sql : "SELECT * FROM departments;",
            result : true
        }, function(err, data) {
            if(err) { // Basic error handling
                console.error(err);
                callback(err, null);
                throw err;
            }

            for(var i = 0; i < data.length; i++) {
                // Loop through all entries and make new departments
                result.push(new Department(data[i].id, data[i].title));
            }
            callback(null, result);
        });
    }
}

//testing
function main() {
    Employee.fetchAll(function(err, data) {
        console.log(data[0].positions);
    })
}

main()