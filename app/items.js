const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require("nanoid");
const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const createRouter = connection => {
    const router = express.Router();

    router.get('/', (req, res) => {

            connection.query('SELECT * FROM `Items`', (error, results) => {
                if (error) {
                    res.status(500).send({error: 'Database error'});
                }
                res.send(results);
            });
    });

    router.get('/:id', (req, res) => {
        connection.query('SELECT * FROM `Items` WHERE `id` = ?', req.params.id, (error, results) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            if (results[0]) {
                res.send(results[0]);
            } else {
                res.status(404).send({error: 'Item not found'})
            }
        });
    });

    router.post('/', upload.single('image'), (req, res) => {
        console.log(req.body);
        const item = req.body;

        if (req.file) {
            item.image = req.file.filename;
        }

        connection.query('INSERT INTO `Items` (`name`, `category_fk`, `place_fk`, `description`, `image`) VALUES (?, ?, ?, ?, ?)', [item.name, item.category, item.place, item.description, item.image], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: 'Database error'});
            } else {
                res.send({message: 'New item added'});
            }

        });
    });

    router.put('/:id', upload.single('image'), (req, res) => {
        const item = req.body;
        item.id = req.params.id;

        if (req.file) {
            item.image = req.file.filename;
        }
        connection.query('UPDATE `Items` SET `name`= ?, `category_fk`= ?, `place_fk`= ?, `description`= ?, `image`= ? WHERE `id`= ?', [item.name, item.category, item.place, item.description, item.image, item.id], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: 'Database error'});
            } else {
                res.send({message: `Item ${item.id} has changed`});
            }

        });
    });

    router.delete('/:id', (req, res) => {
        const item = req.body;
        item.id = req.params.id;

        connection.query('DELETE FROM `Items` WHERE `id`= ?', item.id, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: 'Database error'});
            } else {
                res.send({message: `Item ${item.id} deleted`});
            }

        });
    });

    return router;
};

module.exports = createRouter;