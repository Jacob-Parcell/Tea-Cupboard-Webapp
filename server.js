const express = require('express');
const app = express();

app.use(express.static('public'));

const PORT = process.env.PORT || 4001;

const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan('tiny'));

let urlEncodedParser = bodyParser.urlencoded({ extended: false });

const db = require('./server/db.js');

app.get('/teas', (req, res, next) => {
    console.log('GET /teas received');
    db.getTableData().then(results => {res.status(200).send(results);});
});

app.get('/teas/:teaName', (req, res, next) => {
    console.log('GET /teas/:teaName receieved');
    db.getTeaByName(req.params.teaName).then(result => {res.status(200).send(result)});
});

app.post('/teas', urlEncodedParser, (req, res, next) => {
    console.log('POST received');
    console.log(req.body.teaName);

    db.addNewTea(req.body).then(result => {
        res.status(201).send(result);
    }).catch(err => {
        console.error('Error adding tea:', err);
        res.status(500).send('Internal Server Error');
    });
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
            <div>
                <button type="button" id="createTeaButton" onclick="addTeaClicked()">+</button>
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

app.put('/teas/:teaName', (req, res, next) => {
    console.log('UPDATE /teas/:teaName received');

    db.updateTea(req.params.teaName, req.body).then(results => {res.status(200).send(results);});
});

app.delete('/teas/:teaName', (req, res, next) => {
    console.log('DELETE /teas/:teaName received');
    db.deleteTea(req.params.teaName).then(result => {
        res.status(204).send();
    }).catch(err => {
        console.error('Error deleting tea:', err);
        res.status(500).send('Internal Server Error');
    });
});

app.listen(PORT, (err) => {
    if(err) {
        console.log(err);
    }
    else {
        console.log(`Listening on port ${PORT}`);
    }
});