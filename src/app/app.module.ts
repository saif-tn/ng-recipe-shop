import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// Using StoreModule to implement NGRX
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
// using NgRx effects
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/store/auth.effects';
import { RecipeEffects } from './recipes/store/recipe.effects';

// adding devtools NgRx
// to monitor states in chrome
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// we rae adding the Router store
import { StoreRouterConnectingModule } from '@ngrx/router-store';


// splitting app into certain modules
// RecipesModule
// import { RecipesModule } from './recipes/recipes.module';
// ShoppingListModule
// import { ShoppingListModule } from './shopping-list/shopping-list.modules';
// SharedModule
import { SharedModule } from './shared/shared.module';
// CoreModule
import { CoreModule } from './core.module';
// import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';
// import { authReducer } from './auth/store/auth.reducer';
// REPLACED WITHJ GLOBAL APP REDUCER
import * as fromApp from '../app/store/app.reducer';
import { environment } from '../environments/environment';
// AuthModule
// import { AuthModule } from './auth/auth.module';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    // NgRX
    StoreModule.forRoot(fromApp.appReducer),
    // NgRx effects
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),
    // splitting 2 main modules
    // removed because of the lazy loading implementation
    // RecipesModule,
    // ShoppingListModule,
    // AuthModule,
    SharedModule,
    // providers // services
    CoreModule,
    // devtools NgRX
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    StoreRouterConnectingModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
