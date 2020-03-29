import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public type: string;
  public ingredients: Ingredient[];

  constructor(name: string, desc: string, type: string, imagePath: string, ingredients: Ingredient[]) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.type = type;
    this.ingredients = ingredients;
  }
}
