// @ts-ignore
module.exports = {
	development: {
		database: {
			url: process.env.MONGODB_URI,
			options: {
				useNewUrlParser: true,
				dbName: process.env.MONGODB_DB,
			},
		},
	},
	local: {
		database: {
			url: process.env.MONGODB_URI,
			options: {
				useNewUrlParser: true,
				dbName: process.env.MONGODB_DB,
			},
		},
	},
	production: {
		database: {
			url: process.env.MONGODB_URI,
			options: {
				useNewUrlParser: true,
				dbName: process.env.MONGODB_DB,
			},
		},
	},
};
