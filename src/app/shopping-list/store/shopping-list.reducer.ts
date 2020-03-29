import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface AppState {
    shoppingList: State;
}

// using interface to use it in all components
export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}
const intialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};


// creating the reducer
export function shoppingListReducer(state: State = intialState, action: ShoppingListActions._ShoppingListActions) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
            break;
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
            break;
        case ShoppingListActions.UPDATE_INGREDIENT:
            // get the single ingredient to edit
            const ingredient = state.ingredients[state.editedIngredientIndex];
            // create a copy the old ingredient
            const updateIngredient = {
                ...ingredient,
                ...action.payload
            };
            // create a copy the old ingredients
            const updateIngredients = [...state.ingredients];
            updateIngredients[state.editedIngredientIndex] = updateIngredient;

            return {
                ...state,
                ingredients: updateIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };
            break;
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter( (ingd, ingdIndex) => {
                    // comparing the index of ingredient and return false
                    return ingdIndex !== state.editedIngredientIndex;
                }),
                editedIngredientIndex: -1,
                editedIngredient: null
            };
            break;
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredient: { ...state.ingredients[action.payload]},
                editedIngredientIndex: action.payload
            };
            break;
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
            break;
        default:
            return state;
            break;
    }
}
