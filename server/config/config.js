var path = require('path');
 
module.exports = {
	jwtSecretToken: 'sdf3d345ty4507kresax',
	nedb : {
        eventsSource: path.join(__dirname, '..', 'db', 'nedb-events.db'),
        readModel: path.join(__dirname, '..', 'db', 'nedb-readmodel.db')
	}
};
