const { assert } = require('chai');
const { expect } = require('chai');
const moment = require('moment');
const { checkAvailability } = require('./scheduler');

describe('Scheduler test', () => {

  let mockData;

  it('should return no campsites if search dates fall inside all reservations', () => {
    mockData = {
      search: { startDate: "2018-06-02", endDate: "2018-06-04"},
      campsites: [
        {"id": 1, "name": "Jackson Hole"},
        {"id": 2, "name": "Aspen"}, 
        {"id": 3, "name": "Patagonia"}
        ],
      reservations: [
        {"campsiteId": 1, "startDate": "2018-06-01", "endDate": "2018-06-03"},
        {"campsiteId": 2, "startDate": "2018-06-03", "endDate": "2018-06-10"},
        {"campsiteId": 3, "startDate": "2018-06-01", "endDate": "2018-06-06"}, 
        ]
     };

    const expected = [];
    expect(checkAvailability(mockData)).to.deep.equal(expected);
  })

  it('should return no campsites if reservation dates fall inside search dates', () => {
    mockData = {
      search: { startDate: "2018-06-01", endDate: "2018-06-10"},
      campsites: [
        {"id": 1, "name": "Jackson Hole"},
        {"id": 2, "name": "Aspen"}, 
        {"id": 3, "name": "Patagonia"}
        ],
      reservations: [
        {"campsiteId": 1, "startDate": "2018-06-02", "endDate": "2018-06-04"},
        {"campsiteId": 2, "startDate": "2018-06-06", "endDate": "2018-06-09"},
        {"campsiteId": 3, "startDate": "2018-06-03", "endDate": "2018-06-06"}, 
        ]
     };

    const expected = [];
    expect(checkAvailability(mockData)).to.deep.equal(expected);
  })

  it('should return no campsites if search dates fall in between a reservation', () => {
    mockData = {
      search: { startDate: "2018-06-05", endDate: "2018-06-07"},
      campsites: [
        {"id": 1, "name": "Jackson Hole"},
        {"id": 2, "name": "Aspen"}, 
        {"id": 3, "name": "Patagonia"}
        ],
      reservations: [
        {"campsiteId": 1, "startDate": "2018-06-02", "endDate": "2018-06-08"},
        {"campsiteId": 2, "startDate": "2018-06-03", "endDate": "2018-06-09"},
        {"campsiteId": 3, "startDate": "2018-06-01", "endDate": "2018-06-21"}, 
        ]
     };

     const expected = [];
     expect(checkAvailability(mockData)).to.deep.equal(expected);
  })

  it('should return no campsites if search dates match a reservation', () => {

    mockData = {
      search: { startDate: "2018-06-05", endDate: "2018-06-07"},
      campsites: [
        {"id": 1, "name": "Jackson Hole"},
        {"id": 2, "name": "Aspen"}, 
        {"id": 3, "name": "Patagonia"}
        ],
      reservations: [
        {"campsiteId": 1, "startDate": "2018-06-05", "endDate": "2018-06-07"},
        {"campsiteId": 2, "startDate": "2018-06-05", "endDate": "2018-06-07"},
        {"campsiteId": 3, "startDate": "2018-06-05", "endDate": "2018-06-07"},
        ]
     };

     const expected = [];
     expect(checkAvailability(mockData)).to.deep.equal(expected);
  })  

  it('should return no campsite if search start or end date match a reservation start or end date', () => {

    const mockDataWithStartOrEndMatch = {
      search: { startDate: "2018-06-05", endDate: "2018-06-07"},
      campsites: [
        {"id": 1, "name": "Jackson Hole"},
        {"id": 2, "name": "Aspen"}, 
        {"id": 3, "name": "Patagonia"}
        ],
      reservations: [
        {"campsiteId": 1, "startDate": "2018-06-05", "endDate": "2018-06-09"},
        {"campsiteId": 2, "startDate": "2018-06-07", "endDate": "2018-06-09"},
        {"campsiteId": 3, "startDate": "2018-06-04", "endDate": "2018-06-07"},
        ]
     };

     const expected = [];
     expect(checkAvailability(mockData)).to.deep.equal(expected);
  })

  it('should return available campsites', () => {

    mockData = {
      search: { startDate: "2018-06-04", endDate: "2018-06-06"},
      campsites: [
        {"id": 1, "name": "Jackson Hole"},
        {"id": 2, "name": "Aspen"}, 
        {"id": 3, "name": "Patagonia"}, 
        {"id": 4, "name": "The Bob"}, 
        {"id": 5, "name": "Moab"}
        ],
      reservations: [
        {"campsiteId": 1, "startDate": "2018-06-08", "endDate": "2018-06-10"},
        {"campsiteId": 2, "startDate": "2018-06-01", "endDate": "2018-06-01"},
        {"campsiteId": 2, "startDate": "2018-06-02", "endDate": "2018-06-03"}, 
        {"campsiteId": 2, "startDate": "2018-06-07", "endDate": "2018-06-09"}, 
        {"campsiteId": 3, "startDate": "2018-06-01", "endDate": "2018-06-02"},
        {"campsiteId": 3, "startDate": "2018-06-08", "endDate": "2018-06-09"},
        {"campsiteId": 4, "startDate": "2018-06-07", "endDate": "2018-06-10"} ]
     };

    const expected = [ 'Aspen', 'The Bob', 'Moab'];
    expect(checkAvailability(mockData)).to.deep.equal(expected);
  })
})