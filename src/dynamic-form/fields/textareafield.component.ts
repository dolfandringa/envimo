import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';
 

@Component({
  selector: 'textarea-field',
  template: `
<ion-item [formGroup]="formGroup">
  <ion-label [attr.for]="config.key" floating>{{config.label}}</ion-label>
  <ion-textarea [formControlName]="config.key" [id]="config.key" [type]="config.stringFormat"></ion-textarea>
  <p item-end *ngIf="!valid" class="errorMessage">
    <em ion-text color="danger" *ngIf="errors.required">Required</em>
    <em ion-text color="danger" *ngIf="errors.maxlength">Value can't be longer than {{errors.maxlength.requiredLength}} characters. Please remove {{errors.maxlength.actualLength - errors.maxlength.requiredLength}} characters.</em>
    <em ion-text color="danger" *ngIf="errors.minlength">Value needs to be at least {{errors.minlength.requiredLength}} characters. Please add {{errors.minlength.requiredLength - errors.minlength.actualLength }} characters.</em>
  </p>
</ion-item>
  `
})
export class TextAreaFieldComponent extends BaseFieldComponent{
}