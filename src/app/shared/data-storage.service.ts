import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
// adding NgRx
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';


@Injectable({ providedIn: 'root' })
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private store: Store<fromApp.AppState>) {}

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
            // this.recipeService.setRecipes(recipes);
            // NgRx
            this.store.dispatch(
              new RecipesActions.SetRecipes(recipes)
            );
          }) // tap
      ); // pipe
  }
}
