const db = require('../server/db.js');
const should = require('chai').should();


describe('database helper functions', function() {

    let tea1 = {name: "mint", modality: "Loose Leaf", caffeinated: "Non-Caffeinated", flavors: "peppermint, earthy, sweet", health_qualities: "relieves sore throat", instructions: "just add water"};

    let tea1Also = {name: "mint", modality: "Loose Leaf", caffeinated: "Non-Caffeinated", flavors: "peppermint, earthy, sweet", health_qualities: "relieves sore throat", instructions: "just add water"};

    let tea1DifferentModality = {name: "mint", modality: "Teabag", caffeinated: "Non-Caffeinated", flavors: "peppermint, earthy, sweet", health_qualities: "relieves sore throat", instructions: "just add water"};

    let tea2 = {name: "lavender", modality: "Loose Leaf, Teabag", caffeinated: "Caffeinated", flavors: "lavender, rose, hibiscus", health_qualities: "relieves headaches", instructions: "steep for 2 minutes"};

    it('compareTeas() function should return -1 when given the same object', function() {
        let result1a = db.compareTeas(tea1, tea1);
        should.equal(result1a, -1);
    });

    it('compareTeas() function should return -1 when given objects with identical values', function() {
        let result = db.compareTeas(tea1, tea1Also);
        should.equal(result, -1);
    });
});