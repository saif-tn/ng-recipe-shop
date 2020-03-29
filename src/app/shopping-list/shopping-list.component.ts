import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Store } from '@ngrx/store';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // ingredients: Ingredient[];
  // changed to observable to use it with ngRX
  ingredients: Observable<{ingredients: Ingredient[]}>;
  // private subscription: Subscription;

  constructor(private store: Store<fromShoppingList.AppState>) { }

  ngOnInit() {
    // using the store from ngRX
    this.ingredients = this.store.select('shoppingList');
    // or use
    // this.store.select('shoppingList').subscribe()
    // removed because of the ngRX
    /*
    this.ingredients = this.slService.getIngredients();
    this.subscription = this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      );
      */
  }

  onEditItem(index: number) {
    // removed because of NgRx, it is no longer needed 
    // this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
