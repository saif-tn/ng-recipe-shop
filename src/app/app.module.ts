import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';

// splitting app into certain modules
// RecipesModule
// import { RecipesModule } from './recipes/recipes.module';
// ShoppingListModule
// import { ShoppingListModule } from './shopping-list/shopping-list.modules';
// SharedModule
import { SharedModule } from './shared/shared.module';
// CoreModule
import { CoreModule } from './core.module';
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
    // splitting 2 main modules
    // removed because of the lazy loading implementation
    // RecipesModule,
    // ShoppingListModule,
    // AuthModule,
    SharedModule,
    // providers // services
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
