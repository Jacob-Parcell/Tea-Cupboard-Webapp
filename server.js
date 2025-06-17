const express = require('express');
const app = express();

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan('tiny'));

const db = require('./server/db.js');

app.get('/teas', (req, res, next) => {
    console.log('call received');
    db.getTableData().then(results => {res.status(200).send(results);});
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
            <input type="text" id="searchBar" onkeyup="searchTeas()" placeholder="Search.."></br>
            <input type="checkbox" id="caffeinated">
            <label for="caffeinated">Caffeinated</label>
            <input type="checkbox" id="non-caffeinated">
            <label for="non-caffeinated">Non-Caffeinated</label>
            </div>

            <main>
                <section class="tiles-container" id="tilesContainer">
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