import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';
 

@Component({
  selector: 'image-field',
  template: `
<ion-item [formGroup]="formGroup">
  <ion-label [attr.for]="config.key" floating>{{config.label}}</ion-label>
  <ion-image-input item-content [formControlName]="config.key" [id]="config.key"></ion-image-input>
  <p item-end *ngIf="!valid" class="errorMessage">
    <em ion-text color="danger" *ngIf="getErrors().required">Required</em>
  </p>
</ion-item>
  `
})
export class ImageFieldComponent extends BaseFieldComponent{
}