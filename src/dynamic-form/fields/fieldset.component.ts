import { Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';
 

@Component({
  selector: 'field-set',
  template: `
<ion-item [formGroup]="formGroup">
  <fieldset [formGroupName]="config.key">
  <legend>{{config.label}}</legend>
  <ng-template
    *ngFor="let field of config.fields;"
    dynamicField
    [config]="field"
    [subForms]="config.subforms"
    [formGroup]="formGroup.get(config.key)"
    (fieldAdded) = "addField($event)"
    >
  </ng-template>
  </fieldset>
</ion-item>
  `
})
export class FieldSetComponent extends BaseFieldComponent{
  fields: {[s: string]: BaseFieldComponent} = {};
  addField(field: BaseFieldComponent){
    this.fields[field.key] = field;
    //field.loadFinalize();
  }
  
  loadFinalize() {
    console.log('FieldSet loadFinalize');
    super.loadFinalize();
    console.log('Fieldset fields', this.fields);
    for(let fname in this.fields){
      console.log('Finalizing field loading for field', fname);
      this.fields[fname].loadFinalize();
    }
  }
}
