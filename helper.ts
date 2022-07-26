// @ts-ignore
const XIVAPI = require("@xivapi/js");
const dbModels = require("./db/models");

module.exports = {
	xiv: new XIVAPI(),
	models: dbModels.default,
};
