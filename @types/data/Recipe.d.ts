import { ClassJob } from "./ClassJob";
import { Item } from "./Item";

export interface RecipeResult {
	ID: number;
	Name_de: string;
	Name_en: string;
	Name_fr: string;
	Name_ja: string;
	IconID: number;
	IsExpert: boolean;
	IsSpecializationRequired: boolean;

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
	AmountResult: number;

	ClassJob: ClassJob;

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

	ItemResult: Item;
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

export interface RecipeResponse extends Response {
	Pagination: Pagination;
	Results: Array<RecipeResult>;
}
