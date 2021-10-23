const express = require('express');
const db = require('../fileDb');
const nanoid = require("nanoid");

const createRouter = connection => {
    const router = express.Router();

    router.get('/', (req, res) => {
        connection.query('SELECT * FROM `Categories`', (error, results) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            res.send(results);
        });

    });

    router.get('/:id', (req, res) => {
        connection.query('SELECT * FROM `Categories` WHERE `id` = ?', req.params.id, (error, results) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            if (results[0]) {
                res.send(results[0]);
            } else {
                res.status(404).send({error: 'Category not found'})
            }
        });
    });

    router.post('/', (req, res) => {
        console.log(req.body);
        const category = req.body;

        connection.query('INSERT INTO `Categories` (`name`, `description`) VALUES (?, ?)', [category.name, category.description], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: 'Database error'});
            } else {
                res.send({message: 'OK'});
            }

        });
    });

    router.put('/:id', (req, res) => {
        console.log(req.body);
        const category = req.body;
        category.id = req.params.id;

        connection.query('UPDATE `Categories` SET `name`= ?, `description`= ? WHERE `id`= ?', [category.name, category.description, category.id], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: 'Database error'});
            } else {
                res.send({message: 'OK'});
            }

        });
    });

    router.delete('/:id', (req, res) => {
        const category = req.body;
        category.id = req.params.id;

        connection.query('DELETE FROM `Categories` WHERE `id`= ?', category.id, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: 'Database error'});
            } else {
                res.send({message: `Item ${category.id} deleted`});
            }

        });
    });

    return router;
};

module.exports = createRouter;