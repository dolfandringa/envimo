import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';


@Component({
  selector: 'radio-field',
  template: `
  <div [formGroup]="formGroup">
  <ion-list radio-group [formControlName]="config.key" [id]="config.key">
    <ion-list-header>
      {{config.label}}
    </ion-list-header>
    <ion-item *ngFor="let opt of config.options">
      <ion-label>{{opt.label}}</ion-label>
      <ion-radio [value]="opt.id"></ion-radio>
    </ion-item>

    <p item-end *ngIf="!valid" class="errorMessage">
      <em ion-text color="danger" *ngIf="errors.required">Required</em>
    </p>
  </ion-list>
  </div>
  `
})
export class RadioFieldComponent extends BaseFieldComponent{
}
