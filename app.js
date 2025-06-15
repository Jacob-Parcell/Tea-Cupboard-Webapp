const sqlite = require('sqlite3');
const db = new sqlite.Database('./data/db.sqlite');

let teaData;

db.all('SELECT * FROM Teas', (err, row) => {
    
    if(err) {
        console.log(err);
    }
    else {
        teaData = row;
    }
    
});

/*for(let i = 0; i < teaData.length; i++) {
    console.log(teaData[i]);
}*/

module.exports = {teaData};