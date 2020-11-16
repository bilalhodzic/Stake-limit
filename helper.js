const {
  getDeviceDetails,
  getTicketMessage,
  getTicketMessageTime,
} = require("./controllers/getQueries");
const dayjs = require("dayjs");
const { updateDeviceStake } = require("./controllers/updateQueries");

//return datetime from a given date object
const makeStartTime = (date) => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
const addStakeToSum = async (ticketMessage) => {
  let device = await getDeviceDetails(ticketMessage.deviceId);
  var sum = device.totalStake;

  let timeNow = dayjs();
  let fromTime = dayjs(device.startTime);
  let interval = timeNow.diff(fromTime, "second");
  if (interval < device.timeDuration) {
    sum += ticketMessage.stake;
    updateDeviceStake(deviceId, ticketMessage.stake);
  } else {
  }
  //console.log(interval);
};

//return true if restriction expired and reverse
const checkRestrExpire = async (deviceId) => {
  let device = await getDeviceDetails(deviceId);

  //compare time between now and restriction started time
  let toTime = dayjs();
  let fromTime = dayjs(device.startRestrTime);
  let interval = toTime.diff(fromTime, "second");

  //compare calculated time with restriction expires date
  return interval > device.restrictionExpires;
};

module.exports = {
  makeStartTime: makeStartTime,
  addStakeToSum: addStakeToSum,
  checkRestrExpire: checkRestrExpire,
};
