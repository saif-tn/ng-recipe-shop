import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipesActions from '../store/recipe.actions';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipeEffects {
    private baseURL = 'https://angular-project-1-649fa.firebaseio.com/';

    @Effect()
    fetchRecipes = this.actions$
    .pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap( () => {
            return this.http.get<Recipe[]>(
                this.baseURL + 'recepies.json', // need to add auth token as param firebase
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

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}
