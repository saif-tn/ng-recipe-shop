import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';

// using NgRx store effects
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;

      // to use it in the Success Alert
    @ViewChild(PlaceholderDirective, {static: true, read: PlaceholderDirective}) alertHost: PlaceholderDirective;
    private closeAlertSucces: Subscription;
    private storeSub: Subscription;

    constructor(private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver,
                private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        // using NgRx
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if (this.error) {
                // using showSuccessAlert to show an error
                this.showSuccessAlert(this.error);
            }
        });
    }
    onSwitchMode() {
        // change the button which sign in / sign up
        this.isLoginMode = !this.isLoginMode;
    }

    onAuthSubmit(form: NgForm) {
        const email = form.value.email;
        const password = form.value.password;
        this.isLoading = true;

        // using commun observable for both login / sign up
        // let authObsv: Observable<AuthResponseData>;

        if (!form.valid) {
            return;
        }
        if (this.isLoginMode) {
            // sign in
            // authObsv = this.authService.signinnUser(email, password);
            // using NgRx
            this.store.dispatch(
                new AuthActions.LoginStart({ email: email, password: password })
              );
        } else {
            // sign up
            // authObsv =  this.authService.signupUser(email, password);
            this.store.dispatch(
                new AuthActions.SignupStart({ email: email, password: password })
            );
        }

        // console.log(form.value);
        form.reset();
    }

    onCloseAlertAuth() {
        // set error to false to hide it in the if
        // this.error = null;
        this.store.dispatch(new AuthActions.ClearError());
    }

    private showSuccessAlert(message: string) {
        const successAlertFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        // we need to tell angular where to add this component
        // solution : view contanier ref
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(successAlertFactory);
        componentRef.instance.errorMessage = message;
        this.closeAlertSucces = componentRef.instance.close.subscribe(() => {
          this.closeAlertSucces.unsubscribe();
          hostViewContainerRef.clear();
        });
    }

    ngOnDestroy() {
        if (this.closeAlertSucces) {
            this.closeAlertSucces.unsubscribe();
        }
        if (this.storeSub) {
            this.storeSub.unsubscribe();
        }
    }



}
