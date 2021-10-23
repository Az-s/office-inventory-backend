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
    const [items] = await mysqlDb.getConnection().query('SELECT * FROM ??', ['items']);
    res.send(items);
});

router.get('/:id', async (req, res) => {
    const [items] = await mysqlDb.getConnection().query(
        `SELECT * FROM ?? where id = ?`,
        ['items', req.params.id])
    if (!items) {
        return res.status(404).send({ error: 'items not found' });
    }

    res.send(items[0]);
});

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.body.title || !req.body.description) {
        return res.status(400).send({ error: 'Data not valid' });
    }

    const items = {
        title: req.body.title,
        description: req.body.description,
    };

    if (req.file) {
        items.image = req.file.filename;
    }

    const newItems = await mysqlDb.getConnection().query(
        'INSERT INTO ?? (title, description , time ,image) values (?, ? , ? , ?)',
        ['places', items.title, items.description, items.time  ,items.image]
    );

    res.send({
        ...items,
        id: newItems[0].insertId
    });
});

router.put('/:id', upload.single('image'), async (req, res) => {
	const items = {
		title: req.body.title,
		description: req.body.description,
	};
	
	if(req.file) items.image = req.file.filename;
	
	await mysqlDb.getConnection().query(
		'UPDATE ?? SET ? where id = ?',
		['items', {...items}, req.params.id]);
	
	res.send({message: `Update successful, id= ${req.params.id}`});
});

router.delete('/:id', async (req, res) => {
    const [items] = await mysqlDb.getConnection().query(
        `DELETE * FROM ?? where id = ?`,
        ['items', req.params.id])

    res.send(items[0]);
});

module.exports = router;