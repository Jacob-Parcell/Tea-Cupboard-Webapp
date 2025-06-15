const express = require('express');
const app = express();

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan('tiny'));

const db = require('./server/db.js');
let teaData;
let promise = db.getTableData().then(results => {teaData = results;});

app.get('/teas', (req, res, next) => {
    console.log('call received');
    res.status(200).send(teaData);
});


app.get('/', (req, res) => {
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Skylar's Tea Shop</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <header>
            <h1>Skylar's Tea Cupboard</h1>
            </header>
            
            <div class="search_header">
            <input type="text" style="text-align: center;" placeholder="Search..">
            <div>button bar: favorites, history, pick a tea for me</div>
            <h2>List of checkboxes and filters</h2>
            </div>

            <main>
                <section class="tiles-container">
                </section>
            </main>
            <script src="index.js" type="text/javascript"></script>
        </body>
        </html>
    `;
    res.send(html);
});


app.listen(PORT, (err) => {
    if(err) {
        console.log(err);
    }
    else {
        console.log(`Listening on port ${PORT}`);
    }
});