module.exports = {
	updateDataCenters: async (xiv: any, models: any) => {
		try {
			let response = await xiv.data.datacenters();

			for (let datacenter in response) {
				await models.DataCenter.replaceOne(
					{
						Name: datacenter,
					},
					{
						Name: datacenter,
						Servers: response[datacenter],
					},
					{ upsert: true }
				);
			}
		} catch (error) {
			console.log("Error: ", error);
		}
	},
};
