import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
// adding NgRx
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  // @Input() title: any;
  // @Output() titleChange: EventEmitter<any> = new EventEmitter<any>();
  typeRecipe: string;

  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    // adding NgRx
    /*
    this.subscription = this.recipeService.recipesChanged
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
      this.recipes = this.recipeService.getRecipes();
      */
    this.subscription = this.store
    .select('recipes')
    .pipe(
        map(
          recipesState => recipesState.recipes
        )
    )
    .subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );

  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
