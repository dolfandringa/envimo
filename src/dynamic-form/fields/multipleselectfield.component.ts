import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';
 

@Component({
  selector: 'string-field',
  template: `
<ion-item [formGroup]="formGroup">
  <ion-label [attr.for]="config.key" floating>{{config.label}}</ion-label>
  <ion-input type="hidden" [formControlName]="config.key" [id]="config.key"></ion-input>
  <button type="button" item-content *ngIf="hasSubForms" ion-button (click)="showSubForms()">Add</button>
  <p item-end *ngIf="!valid" class="errorMessage">
    <em ion-text color="danger" *ngIf="errors.required">Required</em>
  </p>
</ion-item>
<ion-item>
  <ion-grid>
    <ion-row wrap>
      <ion-col width-33 *ngFor="let opt of config.options; let i = index">
        <ion-card>
          <ion-card-header>
              {{ i+1 }}
              <button style="float: right;" ion-button color="dark" clear small (click)="removeOption(opt)">
                <ion-icon name="close"></ion-icon>
              </button>
          </ion-card-header>
          <ion-card-content>
            <p [innerHTML]="sanitizer.bypassSecurityTrustHtml(opt.label)"></p>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</ion-item>
  `
})
export class MultipleSelectFieldComponent extends BaseFieldComponent{
  removeOption(opt) {
    console.log("Removing option", opt);
    let idx = this.value.indexOf(opt.id);
    console.log("Removing value",idx);
    this.value.splice(idx, 1);
    idx = this.config.options.indexOf(opt);
    console.log("Removing option",idx);
    this.config.options.splice(idx, 1);
    console.log(this.value);
  }
}

