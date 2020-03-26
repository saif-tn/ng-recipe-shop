import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent {
    // to make this message setable from outside of this component
    @Input() errorMessage: string;
    @Output() close = new EventEmitter<void>();

    onCloseAlert() {
        this.close.emit();
    }
}
