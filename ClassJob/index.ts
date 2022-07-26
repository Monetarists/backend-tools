interface ClassJobResponse extends Response {
	Pagination: Pagination;
	Results: Array<object>;
}

interface Pagination {
	Page: number;
	PageNext?: number;
	PagePrev?: number;
	PageTotal: number;
	Results: number;
	ResultsPerPage: number;
	ResultsTotal: number;
}

module.exports = {
	updateClassJobs: async (xiv: any, models: any) => {
		let response: ClassJobResponse;
		let columns =
			"ID,Abbreviation,Name_de,Name_en,Name_fr,Name_ja,Icon,ClassJobCategoryTargetID,DohDolJobIndex";

		try {
			let page = 1;
			do {
				console.log("Fetching ClassJob data (Page  " + page + ") ");

				// noinspection TypeScriptValidateJSTypes
				response = await xiv.data.list("ClassJob", {
					columns: columns,
					limit: 100,
					page: page,
				});

				for (let i in response.Results) {
					let column: string =
						response.Results[i][
							"ClassJobCategoryTargetID" as keyof Object
						].toString();

					if (parseInt(column) === 33) {
						await models.ClassJob.replaceOne(
							{
								ID: response.Results[i]["ID" as keyof Object],
							},
							response.Results[i],
							{ upsert: true }
						);
					}
				}

				page = page + 1;
			} while (response.Pagination.PageNext !== null);
		} catch (error) {
			console.log("Error: ", error);
		}
	},
};
