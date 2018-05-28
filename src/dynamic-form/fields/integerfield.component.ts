import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';
 

@Component({
  selector: 'integer-field',
  template: `
<ion-item [formGroup]="formGroup">
  <ion-label [attr.for]="config.key" floating>{{config.label}}</ion-label>
  <ion-input [formControlName]="config.key" [id]="config.key" type="number"></ion-input>
  <p item-end *ngIf="!valid" class="errorMessage">
    <em ion-text color="danger" *ngIf="errors.required">Required</em>
    <em ion-text color="danger" *ngIf="errors.notInteger">Only whole numbers are allowed.</em>
    <em ion-text color="danger" *ngIf="errors.min">{{config.label}} should be at least {{errors.min.min}}.</em>
    <em ion-text color="danger" *ngIf="errors.max">{{config.label}} should be no more than {{errors.max.max}}.</em>
  </p>
</ion-item>
  `
})
export class IntegerFieldComponent extends BaseFieldComponent{
}
