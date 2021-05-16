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


db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

//default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404)
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});