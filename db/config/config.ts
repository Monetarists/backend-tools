// @ts-ignore
module.exports = {
	development: {
		database: {
			url: process.env.MONGODB_URI,
			options: {
				useNewUrlParser: true,
				dbName: "localhost",
			},
		},
	},
	local: {
		database: {
			url: process.env.MONGODB_URI,
			options: {
				useNewUrlParser: true,
				dbName: "localhost",
			},
		},
	},
	production: {
		database: {
			url: process.env.MONGODB_URI,
			options: {
				useNewUrlParser: true,
				dbName: "production",
			},
		},
	},
};
