// @ts-ignore
module.exports = (mongoose: any) => {
	const newSchema = new mongoose.Schema({
		ID: Number,
		Abbreviation: String,
		Name_de: String,
		Name_en: String,
		Name_fr: String,
		Name_ja: String,
		Icon: {
			type: String,
			default: null,
		},
		ClassJobCategoryTargetID: Number,
		DohDolJobIndex: Number,
	});

	// noinspection TypeScriptValidateJSTypes
	return mongoose.model("ClassJob", newSchema, "ClassJob");
};
