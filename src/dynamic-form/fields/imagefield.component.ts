import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';


declare var cordova: any;

@Component({
  selector: 'image-field',
  styles: [
    "ion-image-input.component.scss"
  ],
  template: `
<ion-item [formGroup]="formGroup">
  <ion-label [attr.for]="config.key" floating>{{config.label}}</ion-label>
  <ion-image-input item-content [formControlName]="config.key" [id]="config.key"></ion-image-input>
  <p item-end *ngIf="!valid" class="errorMessage">
    <em ion-text color="danger" *ngIf="errors.required">Required</em>
  </p>
</ion-item>
  `
})
export class ImageFieldComponent extends BaseFieldComponent{


  public pathForImage(img){
    if (img === null){
      return '';
    }
    else{
      img = img.replace('file://', '');
      return cordova.file.dataDirectory + img;
    }
  }

  toText(): string{
    return '<img src="'+this.pathForImage(this.value)+'" />';
  }
}
