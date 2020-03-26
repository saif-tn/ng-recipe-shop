import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;

      // to use it in the Success Alert
    @ViewChild(PlaceholderDirective, {static: true, read: PlaceholderDirective}) alertHost: PlaceholderDirective;
    private closeAlertSucces: Subscription;

    constructor(private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {}

    onSwitchMode() {
        // change the button which sign in / sign up
        this.isLoginMode = !this.isLoginMode;
    }

    onAuthSubmit(form: NgForm) {
        const email = form.value.email;
        const password = form.value.password;
        this.isLoading = true;

        // using commun observable for both login / sign up
        let authObsv: Observable<AuthResponseData>;

        if (!form.valid) {
            return;
        }
        if (this.isLoginMode) {
            // sign in
            authObsv = this.authService.signinnUser(email, password);
        } else {
            // sign up
            authObsv =  this.authService.signupUser(email, password);
        }

        authObsv.subscribe (
            responseData => {
                console.log(responseData);
                this.isLoading = false;
                // show error alert programmatcly
                console.log('authObsv fired! - login success alert');
                this.showSuccessAlert('Hello');
                // redirect user after login
                setTimeout(() => {
                    this.router.navigate(['recipes']);
                }, 2000);
            },
            errorMessage => {
                // all error logic is in the AuthService
                this.isLoading = false;
                this.error = errorMessage;
                console.log('Error from server - onAuthSubmit');
                console.log(errorMessage);
            }
        );

        // console.log(form.value);
        form.reset();
    }

    onCloseAlertAuth() {
        // set error to false to hide it in the if
        this.error = null;
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
        if (this.closeAlertSucces){
            this.closeAlertSucces.unsubscribe();
        }
    }



}
