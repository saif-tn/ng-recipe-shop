import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

// to make it standard we created actions in seperate file
export const ADD_INGREDIENT     = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS    = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT  = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT  = 'DELETE_INGREDIENT';
export const START_EDIT         = 'START_EDIT';
export const STOP_EDIT          = 'STOP_EDIT';

// add single ingreditent action
export class AddIngredient implements Action {
    // readonly is a ts mention to make this prop never changeable from outside
    readonly type = ADD_INGREDIENT;

    constructor(public payload: Ingredient) {}
}

// add ingreditents action with "to shopping list" button
export class AddIngredients implements Action {
    // readonly is a ts mention to make this prop never changeable from outside
    readonly type = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]) {}
}
// update ingreditent action
export class UpdateIngredient implements Action {
    // readonly is a ts mention to make this prop never changeable from outside
    readonly type = UPDATE_INGREDIENT;
    // as mentioned in the updateIngredient in service
    constructor(public payload: Ingredient) {}
}

// delete ingreditent action
export class DeleteIngredient implements Action {
    // readonly is a ts mention to make this prop never changeable from outside
    readonly type = DELETE_INGREDIENT;
}
// start editing which ingreident we are editing
export class StartEdit implements Action {
    readonly type = START_EDIT;
    // the number of ingredient to edit
    constructor(public payload: number) {}

}
export class StopEdit implements Action {
    readonly type = STOP_EDIT;
}


// exporting a union of actions
export type _ShoppingListActions =
AddIngredient
| AddIngredients
| UpdateIngredient
| DeleteIngredient
| StartEdit
| StopEdit;
