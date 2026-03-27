interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  supported_units: [];
  default_unit: string;
}

interface RecipeIngredient {
  amount: number,
  name: string,
  unit: string,
}

interface RecipeInstruction {
  text: string;
  timer: number;
}

interface Recipe {
  id: number,
  title: string,
  difficulty: number,
  cook_time_mins: number,
  instructions: RecipeInstruction[],
  ingredients: RecipeIngredient[],
}

export { type Ingredient, type RecipeInstruction, type Recipe };
