interface RecipeResponse extends Response {
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
	updateRecipes: async (xiv: any, models: any) => {
		let response: RecipeResponse;

		let columns =
			"ID,Name_de,Name_en,Name_fr,Name_ja,IconID,AmountResult,IsExpert,IsSpecializationRequired";
		columns =
			columns +
			",ClassJob.ID,ClassJob.Abbreviation,ClassJob.Name_de,ClassJob.Name_en,ClassJob.Name_fr,ClassJob.Name_ja";
		columns =
			columns +
			",ClassJob.Icon,ClassJob.ClassJobCategoryTargetID,ClassJob.DohDolJobIndex";

		for (let i = 0; i <= 9; i++) {
			columns = columns + ",AmountIngredient" + i;
			columns =
				columns +
				",ItemIngredient" +
				i +
				".ID,ItemIngredient" +
				i +
				".Name_de,ItemIngredient" +
				i +
				".Name_en,ItemIngredient" +
				i +
				".Name_fr,ItemIngredient" +
				i +
				".Name_ja";
			columns =
				columns +
				",ItemIngredient" +
				i +
				".IconID,ItemIngredient" +
				i +
				".IsUntradable,ItemIngredient" +
				i +
				".CanBeHq";
			columns =
				columns +
				",ItemIngredient" +
				i +
				".ItemSearchCategory.ID,ItemIngredient" +
				i +
				".ItemSearchCategory.Name_de,ItemIngredient" +
				i +
				".ItemSearchCategory.Name_en,ItemIngredient" +
				i +
				".ItemSearchCategory.Name_fr,ItemIngredient" +
				i +
				".ItemSearchCategory.Name_ja";
			columns =
				columns +
				",ItemIngredient" +
				i +
				".ItemUICategory.ID,ItemIngredient" +
				i +
				".ItemUICategory.Name_de,ItemIngredient" +
				i +
				".ItemUICategory.Name_en,ItemIngredient" +
				i +
				".ItemUICategory.Name_fr,ItemIngredient" +
				i +
				".ItemUICategory.Name_ja";
		}
		columns =
			columns +
			",ItemResult.ID,ItemResult.Name_de,ItemResult.Name_en,ItemResult.Name_fr,ItemResult.Name_ja,ItemResult.IconID,ItemResult.IsUntradable,ItemResult.CanBeHq";
		columns =
			columns +
			",ItemResult.ItemSearchCategory.ID,ItemResult.ItemSearchCategory.Name_de,ItemResult.ItemSearchCategory.Name_en,ItemResult.ItemSearchCategory.Name_fr,ItemResult.ItemSearchCategory.Name_ja";
		columns =
			columns +
			",ItemResult.ItemUICategory.ID,ItemResult.ItemUICategory.Name_de,ItemResult.ItemUICategory.Name_en,ItemResult.ItemUICategory.Name_fr,ItemResult.ItemUICategory.Name_ja";

		try {
			let page = 1;
			do {
				// noinspection TypeScriptValidateJSTypes
				response = await xiv.data.list("Recipe", {
					columns: columns,
					limit: 100,
					page: page,
				});

				for (let i in response.Results) {
					let recipe: any = response.Results[i];

					if (
						recipe.Name !== null &&
						recipe.ItemResult.ItemSearchCategory.ID !== null
					) {
						await models.Recipe.replaceOne(
							{
								ID: recipe["ID" as keyof Object],
							},
							recipe,
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
