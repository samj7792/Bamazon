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
});

var itemIds = [];
var product = '';
var stockCount = 0;
var addCount = 0;

function promptMngr() {
  inquirer.prompt ([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
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
        case 'Exit':
            exit();
            break;
      }
    })
}

function addInv() {
    var select = 'SELECT * FROM products';
    connection.query(select, function (err,res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            itemIds.push(res[i].item_id);
        }

        var columns = columnify(res, {
            columnSplitter: ' | ', 
            paddingChr: '.',
        });

        console.log('Here is the current stock\n');

        console.log(columns);

        addInvPrompt();
    })
}

function addInvPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What product (by item_id) would you like to add?',
            choices: itemIds,
            name: 'product',
        },
        {
            type: 'prompt',
            message: 'How many would you like to add (enter a number)?',
            name: 'count'
        }
    ]).then(function(inqRes) {

        var select = 'SELECT * FROM products WHERE item_id = ?';
        
        product = inqRes.product;

        //console.log(product);

        addCount = parseInt(inqRes.count);

        connection.query(select, product, function(err,res) {
            if(err) throw err;

            //console.log(res);

            stockCount = res[0].stock_quantity;

            updateDB();
        })
    })
}

function updateDB() {

    var update = 'UPDATE products SET stock_quantity = ? WHERE item_id = ?';

    var updateArr = [stockCount + addCount, product];

    connection.query(update, updateArr, function(err,res) {

        console.log('Products added');

        promptMngr();
    })
}

function lowInv() {
    
    var selectLow = "SELECT * FROM products WHERE stock_quantity < 5"

    connection.query(selectLow, function(err,res) {

        if (err) throw err;

        console.log(res.length);

        var columns = columnify(res, {
            columnSplitter: ' | ',
            paddingChr: '.'
        });

        if (res.length === 0) {
            console.log('No low inventory')

            promptMngr();
        }

        else {
            console.log('Here is the low inventory\n');

            console.log(columns);

            promptMngr();
        }
    })
}

function viewProds() {

    var select = 'SELECT * FROM products';
    connection.query(select, function (err,res) {
        if (err) throw err;

        var columns = columnify(res, {
            columnSplitter: ' | ', 
            paddingChr: '.',
        });

        console.log('Here is what is in stock\n');

        console.log(columns);

        promptMngr();
    })
}

function exit() {
    connection.end();
}