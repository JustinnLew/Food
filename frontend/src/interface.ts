interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  supported_units: [];
  default_unit: string;
}

interface RecipeIngredient {
  amount: number;
  name: string;
  unit: string;
}

interface RecipeMissingIngredient {
  name: string;
  required_amount: number;
  unit: string;
}

interface RecipeInsufficientIngredient {
  name: string;
  required_amount: number;
  user_amount: number;
  user_unit: string;
}

interface RecipeInstruction {
  text: string;
  timer: number;
}

interface Recipe {
  id: number;
  title: string;
  difficulty: number;
  cook_time_mins: number;
  instructions: RecipeInstruction[];
  ingredients: RecipeIngredient[];
  missing_ingredients?: RecipeMissingIngredient[];
  insufficient_ingredients?: RecipeInsufficientIngredient[];
}

export { type Ingredient, type RecipeInstruction, type Recipe };
