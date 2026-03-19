interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  supported_units: [];
  default_unit: string;
}

interface RecipeInstruction {
  text: string;
  timer: number;
}

export { type Ingredient, type RecipeInstruction };
