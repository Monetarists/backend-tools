import { Collection, EntitySchema } from "@mikro-orm/core";
import { IRecipe } from "./Recipe";

export interface IClassJob {
	ID: number;
	Name_en: string;
	Name_de: string;
	Name_fr: string;
	Name_ja: string;
	Abbreviation: string;
	Icon: string | null;
	DohDolJobIndex: number;

	Recipes: Collection<IRecipe>;
}

export const ClassJob = new EntitySchema<IClassJob>({
	name: "ClassJob",
	properties: {
		ID: { type: "number", primary: true },
		Name_en: { type: "string" },
		Name_de: { type: "string" },
		Name_fr: { type: "string" },
		Name_ja: { type: "string" },
		Abbreviation: { type: "string" },
		Icon: { type: "string", nullable: true },
		DohDolJobIndex: { type: "number", default: 0, nullable: true },

		Recipes: {
			reference: "1:m",
			entity: "Recipe",
			mappedBy: (recipe) => recipe.ClassJob,
		},
	},
});
