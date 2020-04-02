import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
// using NgRx
import { Store } from '@ngrx/store';
import * as fromAuth from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  /* managing user login*/
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService,
              private store: Store<fromAuth.AppState>) {}

  ngOnInit() {
    // to get the statuts of user Subject which we will track
    this.userSub = this.store.
    select('auth')
    .pipe(
      map(authState => authState.user)
    )
    .subscribe( user => {
      // if we have a user the isAuthenticated = true
      this.isAuthenticated = !user ? false : true;
    });
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogOut() {
    // this.authService.logoutUser();
    this.store.dispatch(
      new AuthActions.Logout()
    );
  }
}
