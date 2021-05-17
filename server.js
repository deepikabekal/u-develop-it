const mysql = require('mysql2');
const express = require('express');
const e = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const inputCheck = require('./utils/inputCheck');

//add the express.js middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'pass',
      database: 'election'
    },
    console.log('Connected to the election database.')
);


// //route
// app.get('/', (req, res) => {
//     res.json({
//         message : 'Hello World'
//     });
// });

//route to return a list of all potential clients
app.get('/api/candidates', (req, res) => {
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
app.get('/api/candidate/:id', (req, res) => {
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
app.delete('/api/candidate/:id', (req, res) => {
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
app.post('/api/candidate', ({ body }, res) => {
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


//default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404)
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});