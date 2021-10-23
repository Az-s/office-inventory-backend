const express = require('express');
const multer = require('multer');
const path = require('path');
const { nanoid } = require('nanoid');
const config = require('../config');
const mysqlDb = require('../mysqlDb');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', async (req, res) => {
    const [categories] = await mysqlDb.getConnection().query('SELECT * FROM ??', ['categories']);
    res.send(categories);
});

router.get('/:id', async (req, res) => {
    const [categories] = await mysqlDb.getConnection().query(
        `SELECT * FROM ?? where id = ?`,
        ['categories', req.params.id])
    if (!categories) {
        return res.status(404).send({ error: 'categories not found' });
    }

    res.send(categories[0]);
});

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.body.title || !req.body.description) {
        return res.status(400).send({ error: 'Data not valid' });
    }

    const categories = {
        title: req.body.title,
        description: req.body.description,
    };

    if (req.file) {
        categories.image = req.file.filename;
    }

    const newCategories = await mysqlDb.getConnection().query(
        'INSERT INTO ?? (title, description) values (?, ?)',
        ['places', categories.title, categories.description]
    );

    res.send({
        ...categories,
        id: newCategories[0].insertId
    });
});

router.put('/:id', upload.single('image'), async (req, res) => {
	const categories = {
		title: req.body.title,
		description: req.body.description,
	};
	
	if(req.file) categories.image = req.file.filename;
	
	await mysqlDb.getConnection().query(
		'UPDATE ?? SET ? where id = ?',
		['categories', {...categories}, req.params.id]);
	
	res.send({message: `Update successful, id= ${req.params.id}`});
});

router.delete('/:id', async (req, res) => {
    const [categories] = await mysqlDb.getConnection().query(
        `DELETE * FROM ?? where id = ?`,
        ['categories', req.params.id])

    res.send(categories[0]);
});

module.exports = router;