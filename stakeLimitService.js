var stakeLimitService = {
  //Time period in which limiting is being applied (in seconds)
  //Max: 24 hours
  //- Min: 5 minutes
  timeDuration: 300,

  //Amount after which device should be blocked (sum all all stakes in
  //“Time duration”)
  //- Max: 10000000
  //- Min: 1
  stakeLimit: 1,

  /* Percentage of “Stake limit” value, after which
device should be declared as HOT
- Max: 100
- Min: 1 */
  hotPercentage: 1,

  /*::Time after blocked device is automatically unblocked (in
seconds):
- Max: 0 (it never expires)
- Min: 1 minute */
  restrictionExpires: 60,
};

module.exports = stakeLimitService;
