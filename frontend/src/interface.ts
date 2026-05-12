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
  name: string; // TODO: change to 'ingredient' on the backend
  unit: string;
}

interface RecipeMissingIngredient {
  ingredient: string;
  required_amount: number;
  unit: string;
}

interface RecipeInsufficientIngredient {
  ingredient: string;
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
  match_score: number;
  image_src?: string;
}

export { type Ingredient, type RecipeInstruction, type Recipe };
