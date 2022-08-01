import { EntitySchema } from "@mikro-orm/core";
import { IItemSearchCategory } from "./ItemSearchCategory";
import { IItemUICategory } from "./ItemUICategory";
import { IRecipe } from "./Recipe";

export interface IItem {
	ID: number;
	Name_en: string;
	Name_de: string;
	Name_fr: string;
	Name_ja: string;
	IconID: number;
	IsUntradable: boolean;
	CanBeHq: boolean;

	ItemSearchCategory?: IItemSearchCategory;
	ItemUICategory?: IItemUICategory;
	Ingredient0Recipes?: IRecipe;
	Ingredient1Recipes?: IRecipe;
	Ingredient2Recipes?: IRecipe;
	Ingredient3Recipes?: IRecipe;
	Ingredient4Recipes?: IRecipe;
	Ingredient5Recipes?: IRecipe;
	Ingredient6Recipes?: IRecipe;
	Ingredient7Recipes?: IRecipe;
	Ingredient8Recipes?: IRecipe;
	Ingredient9Recipes?: IRecipe;

	ItemResultRecipes?: IRecipe;
}

export const Item = new EntitySchema<IItem>({
	name: "Item",
	properties: {
		ID: { type: "number", primary: true },
		Name_en: { type: "string" },
		Name_de: { type: "string" },
		Name_fr: { type: "string" },
		Name_ja: { type: "string" },
		IconID: { type: "number" },
		IsUntradable: { type: "boolean" },
		CanBeHq: { type: "boolean" },

		ItemSearchCategory: {
			reference: "m:1",
			entity: "ItemSearchCategory",
		},
		ItemUICategory: {
			reference: "m:1",
			entity: "ItemUICategory",
		},
		Ingredient0Recipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
		Ingredient1Recipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
		Ingredient2Recipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
		Ingredient3Recipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
		Ingredient4Recipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
		Ingredient5Recipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
		Ingredient6Recipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
		Ingredient7Recipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
		Ingredient8Recipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
		Ingredient9Recipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
		ItemResultRecipes: {
			reference: "1:m",
			entity: "Recipe",
			nullable: true,
		},
	},
});
