import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';
 

@Component({
  selector: 'select-field',
  template: `
<ion-item [formGroup]="formGroup">
  <ion-label [attr.for]="config.key" floating>{{config.label}}</ion-label>
  <ion-select [formControlName]="config.key" [id]="config.key">
    <ion-option *ngFor="let opt of config.options" [value]="opt.id">{{ opt.label }}</ion-option>
  </ion-select>
  <button type="button" *ngIf="hasSubForms" ion-button item-end (click)="showSubForms()">Add</button>
</ion-item>
<ion-item no-lines>
  <p item-end *ngIf="!valid" class="errorMessage">
    <em ion-text color="danger" *ngIf="errors.required">Required</em>
  </p>
</ion-item>
  `
})
export class SelectFieldComponent extends BaseFieldComponent{
}
