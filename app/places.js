const express = require('express');
const db = require('../fileDb');
const nanoid = require("nanoid");

const createRouter = connection => {
    const router = express.Router();

    router.get('/', (req, res) => {
        connection.query('SELECT * FROM `Places`', (error, results) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            res.send(results);
        });

    });

    router.get('/:id', (req, res) => {
        connection.query('SELECT * FROM `Places` WHERE `id` = ?', req.params.id, (error, results) => {
            if (error) {
                res.status(500).send({error: 'Database error'});
            }
            if (results[0]) {
                res.send(results[0]);
            } else {
                res.status(404).send({error: 'Place not found'})
            }
        });
    });

    router.post('/', (req, res) => {
        console.log(req.body);
        const place = req.body;

        connection.query('INSERT INTO `Places` (`name`, `description`) VALUES (?, ?)', [place.name, place.description], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: 'Database error'});
            } else {
                res.send({message: 'OK'});
            }

        });
    });

    router.put('/:id', (req, res) => {
        //console.log(req.params.id);
        const place = req.body;
        //place.id = req.params.id;

        connection.query('UPDATE `Places` SET `name`= ?, `description`= ? WHERE `id`= ?', [place.name, place.description, place.id], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: 'Database error'});
            } else {
                res.send({message: 'OK'});
            }
        });
    });

    router.delete('/:id', (req, res) => {
        const place = req.body;
        console.log(place);
        place.id = req.params.id;

        connection.query('DELETE FROM `Places` WHERE `id`= ?', place.id, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send({error: 'Database error'});
            } else {
                res.send({message: `Item ${place.id} deleted`});
            }

        });
    });
    return router;
};

module.exports = createRouter;