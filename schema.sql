create database bamazon;

use bamazon;

drop table products;

create table products(
item_id integer not null auto_increment,
product_name varchar(30) not null,
department_name varchar(30) not null,
price decimal(10, 2) not null,
stock_quantity integer(10) not null,
primary key (item_id)
);

select * from products;

insert into products
(product_name, department_name, price, stock_quantity)
values ('Popsicles', 'Frozen', 7.99, 10);

update products
set department_name = 'Fresh Produce'
where product_name = 'Bananas';
