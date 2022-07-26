#!/usr/bin/env node
// @ts-ignore
let yargs = require("yargs/yargs");
// @ts-ignore
let { hideBin } = require("yargs/helpers");
// @ts-ignore
const argv = yargs(hideBin(process.argv))
	.usage(
		"Usage: npm run update-marketboard -- -c CRP|BSM|ARM|GSM|LTW|WVR|ALC|CUL|all"
	)
	.default("c", "all")
	.alias("c", "crafter").argv;
// @ts-ignore
const { models } = require("./helper");

(async () => {
	await models.MarketBoard.deleteMany({});

	if (argv.crafter.includes("CRP") || argv.crafter.includes("all")) {
		await updateMarketBoard("CRP");
	}
	if (argv.crafter.includes("BSM") || argv.crafter.includes("all")) {
		await updateMarketBoard("BSM");
	}
	if (argv.crafter.includes("ARM") || argv.crafter.includes("all")) {
		await updateMarketBoard("ARM");
	}
	if (argv.crafter.includes("GSM") || argv.crafter.includes("all")) {
		await updateMarketBoard("GSM");
	}
	if (argv.crafter.includes("LTW") || argv.crafter.includes("all")) {
		await updateMarketBoard("LTW");
	}
	if (argv.crafter.includes("WVR") || argv.crafter.includes("all")) {
		await updateMarketBoard("WVR");
	}
	if (argv.crafter.includes("ALC") || argv.crafter.includes("all")) {
		await updateMarketBoard("ALC");
	}
	if (argv.crafter.includes("CUL") || argv.crafter.includes("all")) {
		await updateMarketBoard("CUL");
	}

	process.exit(0);
})();

async function updateMarketBoard(crafter: string) {
	if (
		!["CRP", "BSM", "ARM", "GSM", "LTW", "WVR", "ALC", "CUL"].includes(
			crafter
		)
	) {
		return;
	}

	let data = await models.Recipe.find({ "ClassJob.Abbreviation": crafter });

	let itemSet = new Set<number>();
	data.map((recipe: Recipe) => {
		itemSet.add(recipe.ItemResult.ID);
		for (let i = 0; i <= 9; i++) {
			let ingredientIndex = ("ItemIngredient" + i) as RecipeKey;
			if (recipe[ingredientIndex] !== null) {
				let itemId = recipe[ingredientIndex]?.ID || 0;
				if (itemId > 0) {
					itemSet.add(itemId);
				}
			}
		}
	});

	// @ts-ignore
	let itemIds = [...itemSet];
	let max = itemIds.length;
	let dataCenters = await models.DataCenter.find({});

	for (let i in dataCenters) {
		let dataCenter = dataCenters[parseInt(i)];
		for (let j in dataCenter.Servers) {
			let realm = dataCenter.Servers[j];
			let n = 0;
			let m = new Map<number | string, ItemResult>();

			do {
				console.log(
					"Fetching market board data for " +
						realm +
						" / " +
						crafter +
						" (" +
						n +
						" - " +
						(n + 100) +
						")"
				);

				let currentItemIds = itemIds.slice(n, n + 100);
				n = n + 100;

				// console.log(crafter, 'https://universalis.app/api/v2/' + realm + '/' + currentItemIds.join(','));

				const result: CurrentlyShownMultiViewV2 = await fetch(
					"https://universalis.app/api/v2/" +
						realm +
						"/" +
						currentItemIds.join(",")
				).then((res) => {
					return res.json();
				});
				// console.log(result);

				for (let k in result.items) {
					let item = result.items[parseInt(k)];

					let sold = 0,
						soldHistoryNQ: number[] = [],
						soldHistoryHQ: number[] = [];
					item?.recentHistory?.map((entry) => {
						if (
							entry.timestamp >=
							Math.floor(Date.now() / 1000) - 86400
						) {
							sold = sold + entry.quantity;
							if (entry.hq) {
								soldHistoryHQ.push(entry.pricePerUnit);
							} else {
								soldHistoryNQ.push(entry.pricePerUnit);
							}
						}
					});

					let listings = {
						nq: 0,
						hq: 0,
					};
					item?.listings?.map((entry) => {
						listings[entry.hq ? "hq" : "nq"] =
							listings[entry.hq ? "hq" : "nq"] + entry.quantity;
					});

					m.set(item.itemID, {
						itemID: item.itemID,
						crafter: crafter,
						realm: realm,
						minPriceNQ: item.minPriceNQ,
						minPriceHQ: item.minPriceHQ,
						listings: listings,
						sold: sold,
						soldHistoryNQ: soldHistoryNQ,
						soldHistoryHQ: soldHistoryHQ,
					});
				}
			} while (n < max);

			console.log(
				"Inserting market board data for " + realm + " / " + crafter
			);
			await models.MarketBoard.insertMany(
				Object.values(Object.fromEntries(m))
			);
		}
	}
}

type RecipeKey =
	| "ItemIngredient0"
	| "ItemIngredient1"
	| "ItemIngredient2"
	| "ItemIngredient3"
	| "ItemIngredient4"
	| "ItemIngredient5"
	| "ItemIngredient6"
	| "ItemIngredient7"
	| "ItemIngredient8"
	| "ItemIngredient9";

interface ItemResult {
	itemID: number;
	crafter: string;
	realm: string;
	minPriceNQ: number;
	minPriceHQ: number;
	listings: ItemResultListings;
	sold: number;
	soldHistoryNQ: number[];
	soldHistoryHQ: number[];
}

interface ItemResultListings {
	nq: number;
	hq: number;
}

interface CurrentlyShownMultiViewV2 {
	// The item IDs that were requested.
	itemIDs?: number[];
	// The item data that was requested, keyed on the item ID.
	items?: CurrentlyShownView[];
	// The ID of the world requested, if applicable.
	worldID?: number; // int32
	// The name of the DC requested, if applicable.
	dcName?: string;
	// The name of the region requested, if applicable.
	regionName?: string;
	// A list of IDs that could not be resolved to any item data.
	unresolvedItems?: number[];
	// The name of the world requested, if applicable.
	worldName?: string;
}

interface CurrentlyShownView {
	// The item ID.
	itemID: number; // int32
	// The world ID, if applicable.
	worldID?: number; // int32
	// The last upload time for this endpoint, in milliseconds since the UNIX epoch.
	lastUploadTime: number; // int64
	// The currently-shown listings.
	listings?: ListingView[];
	// The currently-shown sales.
	recentHistory?: SaleView[];
	// The DC name, if applicable.
	dcName?: string;
	// The region name, if applicable.
	regionName?: string;
	// The average listing price, with outliers removed beyond 3 standard deviations of the mean.
	currentAveragePrice: number;
	// The average NQ listing price, with outliers removed beyond 3 standard deviations of the mean.
	currentAveragePriceNQ: number;
	// The average HQ listing price, with outliers removed beyond 3 standard deviations of the mean.
	currentAveragePriceHQ: number;
	// The average number of sales per day, over the past seven days (or the entirety of the shown sales, whichever comes first).
	// This number will tend to be the same for every item, because the number of shown sales is the same and over the same period.
	// This statistic is more useful in historical queries.
	regularSaleVelocity: number;
	// The average number of NQ sales per day, over the past seven days (or the entirety of the shown sales, whichever comes first).
	// This number will tend to be the same for every item, because the number of shown sales is the same and over the same period.
	// This statistic is more useful in historical queries.
	nqSaleVelocity: number;
	// The average number of HQ sales per day, over the past seven days (or the entirety of the shown sales, whichever comes first).
	// This number will tend to be the same for every item, because the number of shown sales is the same and over the same period.
	// This statistic is more useful in historical queries.
	hqSaleVelocity: number;
	// The average sale price, with outliers removed beyond 3 standard deviations of the mean.
	averagePrice: number;
	// The average NQ sale price, with outliers removed beyond 3 standard deviations of the mean.
	averagePriceNQ: number;
	// The average HQ sale price, with outliers removed beyond 3 standard deviations of the mean.
	averagePriceHQ: number;
	// The minimum listing price.
	minPrice: number; // int32
	// The minimum NQ listing price.
	minPriceNQ: number; // int32
	// The minimum HQ listing price.
	minPriceHQ: number; // int32
	// The maximum listing price.
	maxPrice: number; // int32
	// The maximum NQ listing price.
	maxPriceNQ: number; // int32
	// The maximum HQ listing price.
	maxPriceHQ: number; // int32
	// A map of quantities to listing counts, representing the number of listings of each quantity.
	stackSizeHistogram?: Object;
	// A map of quantities to NQ listing counts, representing the number of listings of each quantity.
	stackSizeHistogramNQ?: Object;
	// A map of quantities to HQ listing counts, representing the number of listings of each quantity.
	stackSizeHistogramHQ?: Object;
	// The world name, if applicable.
	worldName?: string;
	// The last upload times in milliseconds since epoch for each world in the response, if this is a DC request.
	worldUploadTimes?: Object;
}

interface ListingView {
	// The time that this listing was posted, in seconds since the UNIX epoch.
	lastReviewTime: number; // int64
	// The price per unit sold.
	pricePerUnit: number; // int32
	// The stack size sold.
	quantity: number; // int32
	// The ID of the dye on this item.
	stainID: number; // int32
	// The world name, if applicable.
	worldName?: string;
	// The world ID, if applicable.
	worldID?: number; // int32
	// The creator's character name.
	creatorName?: string;
	// A SHA256 hash of the creator's ID.
	creatorID?: string;
	// Whether or not the item is high-quality.
	hq: boolean;
	// Whether or not the item is crafted.
	isCrafted: boolean;
	// A SHA256 hash of the ID of this listing. Due to some current client-side bugs, this will almost always be null.
	listingID?: string;
	// The materia on this item.
	materia?: MateriaView[];
	// Whether or not the item is being sold on a mannequin.
	onMannequin: boolean;
	// The city ID of the retainer.
	// Limsa Lominsa = 1
	// Gridania = 2
	// Ul'dah = 3
	// Ishgard = 4
	// Kugane = 7
	// Crystarium = 10
	retainerCity: number; // int32
	// A SHA256 hash of the retainer's ID.
	retainerID?: string;
	// The retainer's name.
	retainerName?: string;
	// A SHA256 hash of the seller's ID.
	sellerID?: string;
	// The total price.
	total: number; // int32
}

interface MateriaView {
	// The materia slot.
	slotID: number; // int32
	// The materia item ID.
	materiaID: number; // int32
}

interface SaleView {
	// Whether or not the item was high-quality.
	hq: boolean;
	// The price per unit sold.
	pricePerUnit: number; // int32
	// The stack size sold.
	quantity: number; // int32
	// The sale time, in seconds since the UNIX epoch.
	timestamp: number; // int64
	// Whether or not this was purchased from a mannequin. This may be null.
	onMannequin?: boolean;
	// The world name, if applicable.
	worldName?: string;
	// The world ID, if applicable.
	worldID?: number; // int32
	// The buyer name.
	buyerName?: string;
	// The total price.
	total: number; // int32
}

interface Category {
	ID: number;
	Name: string;
}

interface Item {
	ID: number;
	Name: string;
	IconID: number;
	IsUntradable: boolean;
	CanBeHq: boolean;

	ItemSearchCategory: Category;
	ItemUICategoryTargetID: Category;
}

interface Recipe {
	ID: number;
	Name: string;
	IconID: number;
	AmountResult: number;
	IsExpert: boolean;
	IsSpecializationRequired: boolean;

	ItemResult: Item;

	// Ingredient Amounts
	AmountIngredient0: number;
	AmountIngredient1: number;
	AmountIngredient2: number;
	AmountIngredient3: number;
	AmountIngredient4: number;
	AmountIngredient5: number;
	AmountIngredient6: number;
	AmountIngredient7: number;
	AmountIngredient8: number;
	AmountIngredient9: number;

	// Ingredients
	ItemIngredient0: Item | null;
	ItemIngredient1: Item | null;
	ItemIngredient2: Item | null;
	ItemIngredient3: Item | null;
	ItemIngredient4: Item | null;
	ItemIngredient5: Item | null;
	ItemIngredient6: Item | null;
	ItemIngredient7: Item | null;
	ItemIngredient8: Item | null;
	ItemIngredient9: Item | null;
}
