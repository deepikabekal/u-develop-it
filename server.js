const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//add the express.js middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//route
app.get('/', (req, res) => {
    res.json({
        message : 'Hello World'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

//default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404)
})