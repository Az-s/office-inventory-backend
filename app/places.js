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
    const [places] = await mysqlDb.getConnection().query('SELECT * FROM ??', ['places']);
    res.send(places);
});

router.get('/:id', async (req, res) => {
    const [places] = await mysqlDb.getConnection().query(
        `SELECT * FROM ?? where id = ?`,
        ['places', req.params.id])
    if (!places) {
        return res.status(404).send({ error: 'places not found' });
    }

    res.send(places[0]);
});

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.body.title || !req.body.description) {
        return res.status(400).send({ error: 'Data not valid' });
    }

    const places = {
        title: req.body.title,
        description: req.body.description,
    };

    if (req.file) {
        places.image = req.file.filename;
    }

    const newPlaces = await mysqlDb.getConnection().query(
        'INSERT INTO ?? (title, description) values (?, ?)',
        ['places', places.title, places.description]
    );

    res.send({
        ...places,
        id: newPlaces[0].insertId
    });
});

router.put('/:id', upload.single('image'), async (req, res) => {
	const places = {
		title: req.body.title,
		description: req.body.description,
	};
	
	if(req.file) places.image = req.file.filename;
	
	await mysqlDb.getConnection().query(
		'UPDATE ?? SET ? where id = ?',
		['places', {...places}, req.params.id]);
	
	res.send({message: `Update successful, id= ${req.params.id}`});
});

router.delete('/:id', async (req, res) => {
    const [places] = await mysqlDb.getConnection().query(
        `DELETE * FROM ?? where id = ?`,
        ['places', req.params.id])

    res.send(places[0]);
});

module.exports = router;