const sqlite = require('sqlite3');
const db = new sqlite.Database('./data/db.sqlite');
const _ = require('lodash');


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
    
    if(tea.looseLeaf && tea.teabag) {
        tea.modality = 'Loose Leaf, Teabag';
    }
    else if(tea.looseLeaf) {
        tea.modality = 'Loose Leaf';
    }
    else if(tea.teabag) {
        tea.modality = 'Teabag';
    }

    tea.img_src = 'test tea photo.jpg';

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`INSERT INTO Teas (name, modality, caffeinated, flavors, health_qualities, instructions, img_src) VALUES ('${tea.teaName}', '${tea.modality}', '${tea.caffeine_content}', '${tea.flavor}', '${tea.health}', '${tea.instructions}', '${tea.img_src}');`, (err, row) => {
                
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

function deleteTea(teaName) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`DELETE FROM Teas WHERE name='${teaName}'`, (err, row) => {
                
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

function updateTea(teaName, updatedTea) {
        return new Promise((resolve, reject) => {
        db.serialize(() => {
            
            let currentTea;

            getTeaByName(teaName).then(result => {
                currentTea = result;
            });

            let updateString = compareTeas(currentTea, updatedTea).toString();

            if(updateString) {
                console.log('Sample query:');
                console.log(`UPDATE Teas SET ${updateString} WHERE name='${teaName}'`);
                
                db.run(`UPDATE Teas SET ${updateString} WHERE name='${teaName}'`, (err, row) => {
                    
                    if(err) {
                        reject(err);
                    }
                    else {
                        resolve(row);
                    }
                });
            }
        });
    }); 
}

function compareTeas(tea1, tea2) {

    let changes = [];

    if(_.isEqual(tea1, tea2)) {
        return -1;
    }

    if(tea1.name != tea2.name) {
        changes.push(`name='${tea2.name}'`);
    }

    if(tea1.modality != tea2.modality) {
        changes.push(`modality='${tea2.modality}'`);
    }

    if(tea1.caffeinated != tea2.caffeinated) {
        changes.push(`caffeinated='${tea2.caffeinated}'`);
    }

    if(tea1.flavors != tea2.flavors) {
        changes.push(`flavors='${tea2.flavors}'`);
    }

    if(tea1.health_qualities != tea2.health_qualities) {
        changes.push(`health_qualities='${tea2.health_qualities}'`);
    }

    if(tea1.instructions != tea2.instructions) {
        changes.push(`instructions='${tea2.instructions}'`);
    }

    //console.log(changes);

    return changes;
}

module.exports = {getTableData, getTeaByName, addNewTea, compareTeas};