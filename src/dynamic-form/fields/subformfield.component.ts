import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';
 

@Component({
  selector: 'select-field',
  template: `
<ion-item [formGroup]="formGroup">
  <ion-input type="hidden" [formControlName]="config.key" [id]="config.key"></ion-input>
  <button type="button" ion-button item-start (click)="showSubForms()">Add {{config.label}} information</button>
</ion-item>
<ion-item no-lines>
  <p item-end *ngIf="!valid" class="errorMessage">
    <em ion-text color="danger" *ngIf="errors.required">Required</em>
  </p>
</ion-item>
  `
})
export class SubFormFieldComponent extends BaseFieldComponent{
}
