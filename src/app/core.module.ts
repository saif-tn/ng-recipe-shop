import { NgModule } from '@angular/core';
/* import { ShoppingListService } from './shopping-list/shopping-list.service'; */
import { RecipeService } from './recipes/recipe.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggingInterceptorService } from './shared/logging-interceptor.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
    // there is no need to export anything
    // providers are injected by default in root
    providers: [
        RecipeService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoggingInterceptorService,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true
        }
    ]
})
export class CoreModule {

}
