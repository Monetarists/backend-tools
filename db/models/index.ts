// @ts-ignore
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });
const Mongoose = require("mongoose");
const basename = path.basename(__filename);
const env = process.env.APP_ENV || "development";
const config = require(__dirname + "/../config/config.ts")[env];

if (config.database.url) {
	Mongoose.connect(config.database.url, config.database.options);
} else if (config.database.config.dbName) {
	Mongoose.connect(
		`${config.database.protocol}://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}`,
		config.database.options
	);
} else {
	Mongoose.connect(
		`${config.database.protocol}://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}`,
		config.database.options
	);
}

const db = () => {
	const m: any = {};

	fs.readdirSync(__dirname)
		.filter((file: string) => {
			return (
				file.indexOf(".") !== 0 &&
				file !== basename &&
				file.slice(-3) === ".ts"
			);
		})
		.forEach((file: string) => {
			const model = require(path.resolve(__dirname, file))(Mongoose);
			m[model.modelName as keyof typeof m] = model;
		});

	return m;
};

module.exports = Mongoose;
module.exports.default = db();
