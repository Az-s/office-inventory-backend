const express = require('express');
const cors = require('cors');
const categories = require('./app/categories');
const places = require('./app/places');
const items = require('./app/items');
const mysqlDb = require('./mysqlDb');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const port = 8000;

app.use('/categories' , categories);
app.use('/places' , places);
app.use('/items' , items);

mysqlDb.connect().catch(e => console.log(e));
app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});