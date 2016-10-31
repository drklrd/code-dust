'use strict';
module.exports = (router,server)=>{

	require('./templates')(router);
	require('./real-time-engine')(router,server);
	require('./apis')(router);


}