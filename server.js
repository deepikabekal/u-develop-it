const db = require('./db/connection');
const express = require('express');
const apiRoutes = require ('./routes/apiRoutes');
const PORT = process.env.PORT || 3001;
const app = express();

const inputCheck = require('./utils/inputCheck');

//add the express.js middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/api', apiRoutes);




// //route
// app.get('/', (req, res) => {
//     res.json({
//         message : 'Hello World'
//     });
// });


//default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404)
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});