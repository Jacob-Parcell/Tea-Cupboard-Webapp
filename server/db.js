const sqlite = require('sqlite3');
const db = new sqlite.Database('./data/db.sqlite');


function getTableData() {
    
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all('SELECT * FROM Teas', (err, row) => {
                
                if(err) {
                    reject(err);
                }
                else {
                    resolve(row);
                }
            });
        });
    });
}

function getTeaByName(teaName) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(`SELECT * FROM Teas WHERE name='${teaName}'`, (err, row) => {
                
                if(err) {
                    reject(err);
                }
                else {
                    resolve(row);
                }
            });
        });
    });
}

module.exports = {getTableData, getTeaByName};