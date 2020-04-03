import { Actions, Effect, ofType } from '@ngrx/effects';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as RecipesActions from '../store/recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
    private baseURL = 'https://angular-project-1-649fa.firebaseio.com/';

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        this.baseURL + 'recepies.json'
      );
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(
        this.baseURL + 'recepies.json',
        recipesState.recipes
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
