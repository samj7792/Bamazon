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

function viewSales() {
    
    var join = 'SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments INNER JOIN products ON departments.department_name=products.department_name GROUP BY department_name'

    connection.query(join, function(err,res) {

        if (err) throw err;

        var columns = columnify(res, {
            columnSplitter: ' | ',
            paddingChr: '.',
        });

        console.log('Here are the department sales');

        console.log(columns);

        promptSup();
    })
}

function exit() {
    connection.end();
}