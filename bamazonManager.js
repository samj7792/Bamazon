var mysql = require("mysql");
var columnify = require("columnify");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "github",

  // Your password
  password: "github",
  database: "bamazon"
});

connection.connect(function(err) {

  if (err) throw err;

  console.log("connected as id " + connection.threadId);

  promptMngr();

  connection.end();
});


function promptMngr() {
  inquirer.prompt ([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
        name: 'choice'
      }
    ])
    .then(function(inqRes) {
      switch(inqRes.choice) {
        case 'View Products for Sale':
            viewProds();
            break;
        case 'View Low Inventory':
            lowInv();
            break;
        case 'Add to Inventory':
            addInv();
            break;
        case 'Add New Product':
            newProd();
            break;
      }
    })
}

