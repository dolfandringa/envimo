import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';


@Component({
  selector: 'datetime-field',
  template: `
<ion-item [formGroup]="formGroup">
  <ion-label [attr.for]="config.key" floating>{{config.label}}</ion-label>
  <ion-datetime displayFormat="YYYY-MM-DD HH:mm" pickerFormat="D MMM YYYY h:mm a" [formControlName]="config.key" [id]="config.key"></ion-datetime>
  <p item-end *ngIf="!valid" class="errorMessage">
    <em ion-text color="danger" *ngIf="getErrors().required">Required</em>
  </p>
</ion-item>
  `
})
export class DateTimeFieldComponent extends BaseFieldComponent{
}
