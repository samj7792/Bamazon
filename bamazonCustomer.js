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

  // console.log("connected as id " + connection.threadId);

  displayProducts();

  // connection.end();
});



var purchaseCount = 0;
var stockCount = 0;
var product = "";

function displayProducts() {

  var sequel = "SELECT * FROM products";
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
      purchaseCount = inquirerResponse.purchase;

      connection.query("select * from products where item_id = ?", purchaseCount, function(err,res) {
        if (err) throw err;

        stockCount = res[0].stock_quantity;

        product = res[0].product_name;

        if (stockCount >= purchaseCount) {

          console.log("You chose to purchase " + purchaseCount + " " + product + "(s)");

          console.log("Your purchase cost is $" + (purchaseCount * res[0].price).toFixed(2));

          updateDB();
      
        }

        else {
          console.log("Not enough in stock!");
        }

        //connection.end();
      })

    })

    //connection.end();
  });
}

function updateDB() {
  var update = "update products set stock_quantity = ? where product_name = ?";
  connection.query(update, [stockCount - purchaseCount, product], function(err,res){
    console.log("Products Database Updated");
    connection.end();
  })
}