var mysql = require('mysql');
var columnify = require('columnify');
var inquirer = require('inquirer');

var connection = mysql.createConnection({

    host: 'localhost',

    port: 3306,

    user: 'github',

    password: 'github',

    database: 'bamazon'
});

connection.connect(function(err) {

    if (err) throw err;

    // console.log('connected as id ' + connection.threadId)

    promptSup();
})