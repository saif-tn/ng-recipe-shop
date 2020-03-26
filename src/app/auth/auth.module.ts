import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [AuthComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // to get access : loading spinner ...
        SharedModule,
        // instead of the app routing module
        // removing 'auth' for lazy loading propose
        RouterModule.forChild([
            {path: '', component: AuthComponent}
        ])
    ]
})
export class AuthModule {

}
