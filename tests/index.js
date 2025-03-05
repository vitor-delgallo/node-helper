const Helper = require('./../index.js');

Helper.SOHelper.getServerStatus().then(r => console.log(r));
Helper.SOHelper.getSystemCpuUsage().then(r => console.log(r));
