const express = require ('express');
const route  = express.Router();
const db = require ('../../db/connection');
const router = require('./candidateRoutes');

//get all the parties

router.get('/parties', (req, res) => {
    const sql = `SELECT * FROM parties`
    db.query(sql, (err, rows) => {
        if (err)
        {
            res.status(500).json({error : err.message});
            return;
        }

        res.json({
            message : 'Success',
            data : rows
        });
    });
});

//get single party

router.get('./party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err)
        {
            res.status(400).json({error : err.message});
            return;
        } 

        res.json({
            message: 'Success', 
            data : row
        });
    });
});

//delete a party 

router.delete('./party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql,params, (err, row) => {
        if (err)
        {
            res.status(400).json({error : err.message});
        } else if (!row.affectedRows)
        {
            res.json({
                message  : 'Party Not Found'
            });
        }
        else
        {
           res.json({
               message : 'Deleted',
               changes : row.affectedRows,
               id : req.params.id
           }); 

        }
    });
});

module.exports = router;