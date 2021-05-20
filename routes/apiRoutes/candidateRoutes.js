const express = require ('express');
const router = express.Router();
const db = require ('../../db/connection');
const inputCheck = require ('../../utils/inputCheck');


//route to return a list of all potential clients
router.get('/candidates', (req, res) => {
    db.query(`SELECT * FROM candidates`, (err, rows) => {
        if (err)
        {
            res.status(500).json({error: err.message});
            return;
        }

        res.json({
            message: "Success",
            data: rows
        });
    });
});

// Get a single candidate
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
  });


  //query fro deleting a candidate
router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if(err)
        {
            res.status(400).json({error : err.message});
            
        } else if (!result.affectedRows)
        {
            res.json({
                message : 'Candidate Not Found'
            });
        } else 
        {
            res.json({
                message : 'Deleted',
                changes : result.affectedRows,
                id : req.params.id
            });
        }        
       
    });

});

//create a candidate
router.post('/candidate', ({ body }, res) => {
    //const body = req.body;

    //inputCheck module was provided for input validation hence we need to import the module
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors)
    {
        res.status(400).json({error : errors});
        return;
    }

    const sql = 'INSERT INTO candidates (first_name, last_name, industry_connected) VALUES ( ?, ?, ?)';
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err)
        {
            res.status(400).json({error : err.message});
            return;
        }
        
        res.json({
            message : 'Success', 
            data : body
        });
    });
    
});

//update candidates party data
router.put('/candidate/:id', (req,res) => {
    //making sure that the party_id is
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE candidates SET party_id = ?
                WHERE ID = ?`;
    const params = [req.body.party_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err)
        {
            res.status(400).json({error : err.message});
        } else if (!result.affectedRows)
        {
            res.json({
                message : 'Candidate Not Found'
            });
        } else
        {
            res.json({
                message : 'Updated', 
                changes : result.affectedRows, 
                data : req.body
            });
        }
    });
});

module.exports = router;