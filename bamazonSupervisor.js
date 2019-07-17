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

function promptSup() {

    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View product sales by department', 'Create new department', 'Exit'],
            name: 'choice'
        }
    ])
    .then(function(inqRes) {

        switch(inqRes.choice) {
            case 'View product sales by department':
                viewSales();
                break;
            case 'Create new department':
                createDpt();
                break;
            case 'Exit':
                exit();
                break;
        }
    })
}

function exit() {
    connection.end();
}