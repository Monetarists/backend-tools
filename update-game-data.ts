#!/usr/bin/env node
// @ts-ignore
const yargs = require("yargs/yargs");
let { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv))
	.usage(
		"Usage: npm run update-game-data [-- -d ClassJob|Recipe|DataCenter|all]"
	)
	.default("d", "all")
	.alias("d", "data").argv;
const { updateRecipes } = require("./Recipe");
const { updateClassJobs } = require("./ClassJob");
const { updateDataCenters } = require("./DataCenter");
// @ts-ignore
const { xiv, models } = require("./helper");

(async () => {
	if (argv.data.includes("Recipe") || argv.data.includes("all")) {
		await updateRecipes(xiv, models);
	}
	if (argv.data.includes("ClassJob") || argv.data.includes("all")) {
		await updateClassJobs(xiv, models);
	}
	if (argv.data.includes("DataCenter") || argv.data.includes("all")) {
		await updateDataCenters(xiv, models);
	}

	process.exit(0);
})();
