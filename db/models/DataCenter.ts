// @ts-ignore
module.exports = (mongoose: any) => {
	const newSchema = new mongoose.Schema({
		Name: String,
		Servers: Array,
	});

	// noinspection TypeScriptValidateJSTypes
	return mongoose.model("DataCenter", newSchema, "DataCenter");
};
