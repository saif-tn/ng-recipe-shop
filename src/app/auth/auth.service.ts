import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


// define type of what we are expecting from firebase API
export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: number;
    localId: string;
    // registred? is optionnal
    registred?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // storing the user auth
    // user = new Subject<User>();
    user = new BehaviorSubject<User>(null);

    // managing the autoLogoutUser with storage in a property
    private expirationDurationTimer: any;

    private apiKey = environment.firebaseAPIKey;
    private signupURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.apiKey;
    private signinURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.apiKey;

    constructor(private http: HttpClient,
                private router: Router) {}

    signupUser(email: string, password: string) {
        // return the result data from post url as <AuthResponseData>
        return this.http.post<AuthResponseData>(
            this.signupURL,
            {
                // based on firebase api
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(
            /* catchError (
                    errorRes => {
                        let errorMessage = 'An inknow error occurred!';
                        // check the error if has message
                        if ( !errorRes.error || !errorRes.error.error) {
                            return throwError(errorMessage);
                        }

                        switch (errorRes.error.error.message) {
                            case 'EMAIL_EXISTS':
                                errorMessage = 'An error occurred!';
                        }
                        return throwError(errorMessage);
                    }
            ) */
            catchError (this.handleError),
            // moving tap code to a new private function to handle auth and user creation
            tap( userData => {
                // using a shared function to handle this
                this.handleAuthentication(
                    userData.email,
                    userData.localId,
                    userData.idToken,
                    userData.expiresIn);
            })
        );
    }

    signinnUser(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.signinURL,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(
            catchError (this.handleError),
            tap( userData => {
                // using a shared function to handle this
                this.handleAuthentication(
                    userData.email,
                    userData.localId,
                    userData.idToken,
                    userData.expiresIn);
            })
        );
    }

    autoLogin() {
        // check if user is already logged in
        // JSON parse converts from text to js object
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            // to auto logout
            // expiration date in mili sec - current date in mili sec = expiration
            const expirationDate = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogoutUser(expirationDate);
        }
    }

    logoutUser() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        // delete the local storage
        localStorage.removeItem('userData');
        // to avoid onther logout auto. with timer in milli secs
        if (this.expirationDurationTimer) {
            clearTimeout(this.expirationDurationTimer);
        }
        this.expirationDurationTimer = null;
    }

    autoLogoutUser(expirationDuration: number) {
        this.expirationDurationTimer = setTimeout( () => {
            this.logoutUser();
        }, expirationDuration);
        console.log('autoLogoutUserexpirationDuration = ' + expirationDuration);
    }

    private handleAuthentication(
        email: string,
        localId: string,
        idToken: string,
        expiresIn: number) {

        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(
            email,
            localId,
            idToken,
            expirationDate);

        this.user.next(user);
        // calling auto logout after a certain time
        this.autoLogoutUser(expiresIn * 1000);
        // local storage of user authenticated
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknow error occurred!';
        // check the error if has message
        if ( !errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        // checking types of errors returned by API Firebase
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'An error occurred!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email does not exists!';
                break;
            case 'INVALID PASSWORD':
                errorMessage = 'Password is not correct!';
                break;
        }
        return throwError(errorMessage);
    }
}
