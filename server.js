const express = require('express');
const app = express();

const port = 3000;

const boxnovelRoute = require('./routes/boxnovelRoute');

app.use('/boxnovel', boxnovelRoute);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})