import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.user.pipe(
            take(1),
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
