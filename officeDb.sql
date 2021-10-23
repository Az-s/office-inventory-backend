drop database if exists office;
create database  if not exists  office;

use office;

create table if not exists categories (
  id int not null auto_increment primary key,
  title varchar(255) not null,
  description text null
);

create table if not exists places (
    id int not null auto_increment primary key,
    title varchar(255) not null,
    description text null
);

create table if not exists items (
    id int not null auto_increment primary key,
    category_id int null,
    title varchar(255) not null,
    description text null,
    place_id int null,
    time datetime default current_timestamp,
    constraint item_category_id_fk
    foreign key(category_id)
    references categories(id)
    on update cascade
    on delete restrict,
    constraint item_place_id_fk
    foreign key(place_id)
    references places(id)
    on update cascade
    on delete restrict
);

insert into categories (title, description)
values
	('Мебель', 'Мягкая'),
	('Компьютерное оборудование', 'Все, связанное с пк');

insert into items (category_id, title, place_id, description)
  values
  	(1, 'кресло', 1, '1 шт' ),
  	(2, 'ноутбук', 2, '2 шт');

SELECT * FROM items;