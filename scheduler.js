const moment = require('moment');

checkAvailability = (CampSpotData) => {

  const searchStart = moment(CampSpotData.search.startDate);
  const searchEnd = moment(CampSpotData.search.endDate);
  const numDaysofBooking = Math.abs(searchStart.diff(searchEnd, 'day'));
  let availableCampsites = [];

  CampSpotData.campsites.forEach( campsite => {

    let closestRes = {};

    CampSpotData.reservations.forEach(reservation => {

      let resStart = moment(reservation.startDate);
      let resEnd = moment(reservation.endDate);
      let dates = { searchStart, searchEnd, resStart, resEnd };

      if (campsite.id === reservation.campsiteId) {

        if (checkAfter(dates) || (!validStart(dates) && calcStartGap(dates) < numDaysofBooking)) {
          if (!validStart(dates) && calcStartGap(dates) < numDaysofBooking) {
            closestRes.start = Object.assign({}, reservation, {conflicts: true});
          } else {
            if (closestRes.start) {
              if (calcStartGap(dates) < closestRes.start.gap) {
                closestRes.start = Object.assign({}, reservation, {gap: calcStartGap(dates)});
              }
            } else {
              closestRes.start = Object.assign({}, reservation, {gap: calcStartGap(dates)});
            }
          }
        }

        if (searchEnd.isSameOrBefore(resEnd) || (!validEnd(dates) && calcEndGap(dates) < numDaysofBooking)) {
          if ((!validEnd(dates) && calcEndGap(dates) < numDaysofBooking) ) {
            closestRes.end = Object.assign({}, reservation, {conflicts: true});
          } else {
            if (closestRes.end) {
              if (calcEndGap(dates) < closestRes.end.gap) {
                closestRes.end = Object.assign({}, reservation, {gap: calcEndGap(dates)});
              }
            } else {
              closestRes.end = Object.assign({}, reservation, {gap: calcEndGap(dates)});
            }
          }
        }
      }
    })

    if ((!closestRes.start || closestResStartGap(searchStart, closestRes) < 2) && (!closestRes.end || closestResEndGap(searchEnd, closestRes) < 2)) {
      if (closestRes.start && closestRes.end) {
        if (resGapLength(closestRes) >= numDaysofBooking) {
          availableCampsites.push(campsite.name);
        }
      } else {
        if (checkConflicts(closestRes)) {
          availableCampsites.push(campsite.name);
        }
        if (!closestResExist(closestRes)) {
          availableCampsites.push(campsite.name);
        }
      }
    }
  })
  return availableCampsites
}

validStart = (dates) => {
  return (dates.searchStart.isSameOrBefore(dates.resEnd)) ? false : true;
}

validEnd = (dates) => {
  return (dates.searchEnd.isSameOrAfter(dates.resStart)) ? false : true;
}

checkAfter = (dates) => {
  return (dates.searchStart.isAfter(dates.resEnd)) ? true : false;
}

closestResExist = (closestRes) => {
  return (!closestRes.start && !closestRes.end) ? false : true;
}

calcEndGap = (dates) => {
  return Math.abs(dates.searchEnd.diff(dates.resStart, 'day'));
}

calcStartGap = (dates) => {
  return Math.abs(dates.searchStart.diff(dates.resEnd, 'day'));
}

checkConflicts = (closestRes) => {
  return ((closestRes.end && !closestRes.end.conflicts) || (closestRes.start && !closestRes.start.conflicts)) ? true : false;
}

closestResStartGap = (searchStart, closestRes) => {
  return Math.abs(searchStart.diff(closestRes.start.endDate, 'day'));
}

closestResEndGap = (searchEnd, closestRes) => {
  return Math.abs(searchEnd.diff(closestRes.end.startDate, 'day'));
}

resGapLength = (closestRes) => {
  return Math.abs(moment(closestRes.start.endDate).diff(closestRes.end.startDate, 'day'));
}

module.exports = { checkAvailability };

