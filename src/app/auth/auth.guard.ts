import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
            return this.authService.user.pipe(
                // to listen once to this subscription
                take(1),
                map(user => {
                    // return to true/false boolean
                    const isAuth = !!user;
                    if (isAuth) {
                        return true;
                    }
                    return this.router.createUrlTree(['/auth']);
                })
            );
    }
}
