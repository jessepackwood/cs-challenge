const fs = require("fs");
const contents = fs.readFileSync('test-case.json');
const CampSpotData = JSON.parse(contents);
const { checkAvailability } = require('./scheduler');


checkAvailability(CampSpotData);
