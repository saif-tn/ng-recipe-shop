import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {}

  private baseURL = 'https://angular-project-1-649fa.firebaseio.com/';

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        this.baseURL + 'recepies.json',
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {

    return this.http.get<Recipe[]>(
                this.baseURL + 'recepies.json', // need to add auth token as param firebase
      ) // get
      .pipe(
          map(recipes => {
            return recipes.map(recipe => {
              return {
                  ...recipe,
                  ingredients: recipe.ingredients ? recipe.ingredients : []
              };
            }); // map
          }), // map
          tap(recipes => {
            this.recipeService.setRecipes(recipes);
          }) // tap
      ); // pipe
  }
}
