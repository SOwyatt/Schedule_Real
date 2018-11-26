/**
 * @fileoverview Defines the Employee class and related subclasses
 * 
 * TODO: Add save and retrive functions
 * 
 * @author Travis Bergeron
 * @version 1.3.0
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
        Position.fetchAll(function(err, data) {
            if(err) { // Basic error handling
                console.error(err);
                callback(err, null);
                throw err;
            }

            let positions = data; // The list of all existing positions

            SQL.parse({
                sql : "SELECT * FROM employees",
                result : true
            }, function(err, data) {
                let result = []; // This is the scope result will be used in
                if(err) { // Basic error handling
                    console.error(err);
                    callback(err, null);
                    throw err;
                }

                for(let i = 0, leni = data.length; i < leni; ++i) { // Loop through all employees
                    let curEmpPos = data[i].positions.split(/,/g); // Split positions at the comma, as they're stored
                    let resultPos = []; // Block scoped so will automatically be reset
                    for(let j = 0, lenj = curEmpPos.length; j < lenj; ++j) { // Loop through all the positions this employee holds
                        for(let k = 0, lenk = positions.length; k < lenk; ++k) { // Loop through all positions that exist
                            if(positions[k].id == curEmpPos[j]) { // If curEmpPos is the same as the position we're on
                                resultPos.push(positions[k]); // Add this position to the employee's positions
                                break; // It can't be more than one position, this saves time
                            }
                        }
                    }
                    result.push(new Employee(data[i].id, data[i].name, resultPos, data[i].email, data[i].stat));
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
     * Compiles a list of all the employees who hold this position
     * @callback compileEmployeesPosCallback 
     */
    compileEmployees(callback) {
        let id = this.id; // Will be out of scope
        Employee.fetchAll(function(err, data) {
            if(err) { // Basic error handling
                console.error(err);
                callback(err, null);
                throw err;
            }
            let result = [];
            for(let i = 0, leni = data.length; i < leni; ++i) { // Loop through all the employees 
                for(let j = 0, lenj = data[i].positions.length; j < lenj; ++j) { // Loop through all the positions this employee holds
                    if(data[i].positions[j].id === id) { // if this position matches the one we belong to
                        result.push(data[i]);
                        break; // Break because the position can't be this one twice
                    }
                }
            }
            callback(null, result);
        });
    }

    /**
     * Fetches all positions from the SQL database
     * @callback fetchAllPositionsCallback
     */
    static fetchAll(callback) {
        Department.fetchAll(function(err, data) {
            if(err) { // Basic error handling
                console.error(err);
                callback(null, err);
                throw err;
            }

            let departments = data; // Will be out of scope

            SQL.parse({
                sql : "SELECT * FROM positions",
                result : true
            }, function(err, data) {
                let result = []; // This is the scope result will be used in
                if(err) { // Basic error handling
                    console.error(err);
                    callback(err, null);
                    throw err;
                }
                for(let i = 0, leni = data.length; i < leni; ++i) {
                    // Truncates the last two digits, turing 310 into 300 etc..
                    let dept = Math.floor(data[i].id / 100) * 100;

                    for(let j = 0, lenj = departments.length; j < lenj; ++j) { // Loop through all departments until a match is found
                        if(dept === departments[j].id) {
                            dept = departments[j]; 
                            break; // Exit loop after department is found, preventing duplicates
                        }
                    }
                    result.push(new Position(data[i].id, dept, data[i].title));
                }
                callback(null, result);
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
     * Compiles a list of all the employees who work in this department
     * @callback compileEmployeesDeptCallback
     */
    compileEmployees(callback) {
        let id = this.id; // This will be out of scope later
        Employee.fetchAll(function(err, data) {
            if(err) { // Basic error handling
                console.error(err);
                callback(err, null);
                throw err;
            }
            let result = [];
            for(let i = 0, leni = data.length; i < leni; ++i) { // Loop through all the employees
                for(let j = 0, lenj = data[i].positions.length; j < lenj; ++j) { // Loop through all positions this employee holds
                    if(data[i].positions[j].department.id === id) { // If this positions department is the same as this department
                        result.push(data[i]);
                        break; // Exit the loop if it matched, preventing duplicates if an employee holds multiple positions in the dept
                    }
                }
            }
            callback(null, result);
        });
    }

    /**
     * Compiles a list of all positions in this department
     * @callback compilePositionsDeptCallback
     */
    compilePositions(callback) {
        let id = this.id; // This will be out of scope later
        Position.fetchAll(function(err, data) {
            if(err) { // Basic error handling
                console.error(err);
                callback(err, null);
                throw err;
            }
            let result = [];
            for(let i = 0, leni = data.length; i < leni; ++i) { // Loop through all positions that exist
                if(data[i].department.id === id) { // If this position's department matches, add it
                    result.push(data[i]);
                }
            }
            callback(null, result);
        });
    }

    /**
     * Fetches all the departments from the SQL
     * @callback fetchAllDeptCallback
     */
    static fetchAll(callback) {
        SQL.parse({
            sql : "SELECT * FROM departments;",
            result : true
        }, function(err, data) {
            let result = [];
            if(err) { // Basic error handling
                console.error(err);
                callback(err, null);
                throw err;
            }

            for(let i = 0, len = data.length; i < len; ++i) {
                // Loop through all entries and make new departments
                result.push(new Department(data[i].id, data[i].title));
            }
            callback(null, result);
        });
    }
}

function main() {
    dept = new Department(100, "Kitchen");
    dept.compilePositions(function(err, data) {
        console.log(data);
    })
}

main();

// module.exports = {
//     Employee : Employee,
//     Department : Department,
//     Position : Position
// };