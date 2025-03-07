const Helper = require('./../index.js');

console.log(Helper.PhoneHelper.removeCountryCode("5514996545535"));
Helper.SOHelper.getServerStatus().then(r => console.log(r));
Helper.SOHelper.getSystemCpuUsage().then(r => console.log(r));
