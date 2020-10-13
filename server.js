const express = require('express');
const app = express();

const port = 3000;

const boxnovelRoute = require('./routes/boxnovelRoute');

app.use('/boxnovel', boxnovelRoute);

app.listen(process.env.PORT || port, () => {
    console.log(`app listening at ${port}`)
})