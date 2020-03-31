import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap, map } from 'rxjs/operators';
// using NgRx
import { Store } from '@ngrx/store';
import * as fromAuth from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService,
                private store: Store<fromAuth.AppState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth').pipe(
            take(1),
            map( authState => {
                return authState.user;
            }),
            exhaustMap( user => {
                // we must check if user exists or not
                if (!user) {
                    return next.handle(req);
                }
                const modReq = req.clone({
                    // adding the auth token params to every url api
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(modReq);
            })
        );
    }
}
