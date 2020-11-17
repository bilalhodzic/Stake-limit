const {
  getDeviceDetails,
  getTicketMessage,
  getTicketMessageTime,
} = require("./controllers/getQueries");
const dayjs = require("dayjs");
const {
  updateDeviceStake,
  updateDeviceStartTime,
} = require("./controllers/updateQueries");

//return datetime from a given date object
const makeStartTime = (date) => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const percentage = (percent, total) => {
  return ((percent / 100) * total).toFixed(2);
};

//function which add stake to total stake
const addStakeToSum = async (ticketMessage, date) => {
  let device = await getDeviceDetails(ticketMessage.deviceId);
  var sum = device.totalStake;

  //if the stake is added in time duration add it to total stake
  let timeNow = dayjs();
  let fromTime = dayjs(device.startTime);
  let interval = timeNow.diff(fromTime, "second");
  if (interval < device.timeDuration) {
    sum += ticketMessage.stake;
    updateDeviceStake(ticketMessage.deviceId, sum);
    return sum;
  } else {
    //if the stake is added when time duration expired--update startTime in device
    updateDeviceStartTime(ticketMessage.deviceId, makeStartTime(date));
    updateDeviceStake(ticketMessage.deviceId, ticketMessage.stake);
    return ticketMessage.stake;
  }
  //console.log(interval);
};

//return true if restriction expired and reverse
const checkRestrExpire = async (deviceId) => {
  let device = await getDeviceDetails(deviceId);

  //compare time between now and restriction started time
  let timeNow = dayjs();
  let fromTime = dayjs(device.startRestrTime);
  let interval = timeNow.diff(fromTime, "second");

  //compare calculated time with restriction expires date
  return interval > device.restrictionExpires;
};
const checkConfPayload = (request) => {
  let error = null;
  if (request.timeDuration < 300 || request.timeDuration > 86400) {
    return (error = "Time duration must be between 300 and 86400 seconds");
  } else if (request.stakeLimit < 1 || request.stakeLimit > 10000000) {
    return (error = "Stake limit must be a number between 1 and 10000000 ");
  } else if (request.hotPercentage < 1 || request.hotPercentage > 100) {
    return (error = "Hot percentage must be a number between 1 and 100 ");
  } else if (
    request.restrictionExpires < 60 &&
    request.restrictionExpires !== 0
  ) {
    return (error = "Restriction  must be more than 60 seconds");
  }
  return error;
};

module.exports = {
  makeStartTime: makeStartTime,
  addStakeToSum: addStakeToSum,
  checkRestrExpire: checkRestrExpire,
  percentage: percentage,
  checkConfPayload: checkConfPayload,
};
