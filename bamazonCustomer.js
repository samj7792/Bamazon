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

  // connection.end();
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
      },
      {
        type: "prompt",
        message: "How many would you like to buy (enter a number)?",
        name: "count"
      }
    ])
    .then(function(inquirerResponse){

      // console.log(inquirerResponse.purchase);

      connection.query("select * from products where item_id = ?", inquirerResponse.purchase, function(err,res) {
        if (err) throw err;

        if (res[0].stock > inquirerResponse.count) {

          console.log("You chose to purchase " + inquirerResponse.count + " " + res[0].product_name + "(s)");

          console.log("Your purchase cost is $" + inquirerResponse.count * res[0].price);
      
        }

        else {
          console.log("Not enough in stock!");
        }

        connection.end();
      })

    })

    //connection.end();
  });
}

