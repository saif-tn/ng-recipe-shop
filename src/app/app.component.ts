import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../app/store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    // calling the login function aot to unsure that on the whole page
    // removed cause of NgRx
    // this.authService.autoLogin();
    this.store.dispatch(
      new AuthActions.AutoLogin()
    );
  }
}
