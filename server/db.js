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

function addNewTea(tea) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`INSERT INTO Teas (name, modality, caffeinated, flavors, health_qualities, instructions) VALUES ('${tea.teaName}', '${tea.modality}', '${tea.caffeine_content}', '${tea.flavor}', '${tea.health}', '${instructions}');`, (err, row) => {
                
                if(err) {
                    reject(err);
                }
                else {
                    resolve(row);
                }
            });
        });
    });}

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