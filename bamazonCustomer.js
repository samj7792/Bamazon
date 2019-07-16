var mysql = require("mysql");
var columnify = require("columnify");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {

  if (err) throw err;

  // console.log("connected as id " + connection.threadId);

  displayProducts();

  connection.end();
});

var sequel = "SELECT * FROM products";

function displayProducts() {
  connection.query(sequel, function(err, res) {

    if (err) throw err;

    // console.log(res);

    var columns = columnify(res, {
      columnSplitter: ' | ',
      paddingChr: '.',
    });

    // Display table of products
    console.log("Here is what is in stock:\n");
    
    console.log(columns);

    var itemIds = [];

    for (var i = 0; i < res.length; i++) {
      itemIds.push(res[i].item_id);
    }

    // Ask user what they would like to buy
    inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to buy (by ITEM_ID)?",
        choices: itemIds,
        name: "purchase"
      }
    ])
    .then(function(inquirerResponse){

      if (inquirerResponse.transport) {
        
      }

    })

    // connection.end();
  });
}

