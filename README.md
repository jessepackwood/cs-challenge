# Documentation 

## Goals

Return campsites that are available for reservation based on a user's requested search queries.

Implement the most basic version of a gap rule to prevent new reservations from creating one-night gaps between themselves and existing reservations. Accomplish this by checking existing reservations and the dates we are booking, and returning only campsite names that can accommodate the new booking without creating gaps.

## Approach

I decided to implement the gap rule by taking in the provided JSON file and iterating over both the campsites and reservations arrays. As long as the ID's for the reservations and the campsites matched, I check to see if the search dates were valid in comparison to the existing reservations for that campsite. Valid start and end dates were dates that did not overlap dates of current reservations. If the start or end search query was invalid I would add a key of 'conflicts' to a new object in a closestReservation object.

If there was a matching reservation for the campsite with valid start and end dates, then I would check to see what the closest matching reservation was. I would go through this process to get the closest reservation for both the start and end search queries. 

Once I have the closest reservation or reservations I can check for a gap against the reservation(s) using the search queries and as long as there is enough time between the reservations without creating a gap, the campsite name is added to an array of available campsites. If there is no closest reservation, the campsite is automatically considered available and added to available campsites. 

After all reservations are considered, the program returns the names of available campsites.

## Assumptions

I assumed that campsites would not be available if the start dates for the search fell within a reservation or overlapped a reservation in addition to not creating a one night gap.

## Set Up

Run `npm install` from the root directory

## Execute

Run `node index.js` to execute functions

## Testing

Run `npm test` to run all tests with Mocha
