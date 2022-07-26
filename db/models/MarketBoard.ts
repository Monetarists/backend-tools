// @ts-ignore
module.exports = (mongoose: any) => {
	const newSchema = new mongoose.Schema({
		itemID: Number,
		crafter: String,
		realm: String,
		minPriceNQ: Number,
		minPriceHQ: Number,
		listings: {
			nq: Number,
			hq: Number,
		},
		sold: Number,
		soldHistoryNQ: Array,
		soldHistoryHQ: Array,
	});

	// noinspection TypeScriptValidateJSTypes
	return mongoose.model("MarketBoard", newSchema, "MarketBoard");
};
