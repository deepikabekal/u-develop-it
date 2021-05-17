const mysql = require('mysql2');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

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


//route
app.get('/', (req, res) => {
    res.json({
        message : 'Hello World'
    });
});

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


//getting a single candidate
app.get('/api/candidate/:id', (res, req) => {

    const params = [req.params.id];
    db.query(`SELECT * FROM candidates WHERE id = ?`, params, (err, rows) => {
        if (err)
        {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success', 
            data: rows
        });
    });
});


//query fro deleting a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if(err)
//     {
//         console.log(err);
//     }
//     console.log(result);
// });

//create a candidate
// const sql = 'INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?, ?, ?, ?)';
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err)
//     {
//         console.log(err);
//     }
//     console.log(result);
// })

//default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404)
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});