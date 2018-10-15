import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';


@Component({
  selector: 'datetime-field',
  template: `
<ion-item [formGroup]="formGroup">
  <ion-label [attr.for]="config.key">{{config.label}}</ion-label>
  <ion-checkbox [formControlName]="config.key" [id]="config.key"></ion-checkbox>
  <p item-end *ngIf="!valid" class="errorMessage">
    <em ion-text color="danger" *ngIf="errors.required">Required</em>
  </p>
</ion-item>
  `
})
export class BooleanFieldComponent extends BaseFieldComponent{
}
