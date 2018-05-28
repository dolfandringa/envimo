import { Component } from '@angular/core';
import { DynamicFormService } from '../dynamic-form.service';
import { FormGroup }   from '@angular/forms';
import { FieldConfig } from '../models/field-config.interface';
import { Field } from '../models/field.interface';

@Component({
  selector: 'base-field',
  template: `
<ion-item>
  <p item-content>Not Implemented</p>
</ion-item>
  `
})
export class BaseFieldComponent implements Field{

  config: FieldConfig;
  formGroup: FormGroup;

  constructor(
    public dfs: DynamicFormService
  ) {}

  get hasSubForms(): boolean{
    return this.config.subforms !== undefined && this.config.subforms.length>0;
  }

  get valid(): boolean{
    if (this.formGroup !== undefined){
      return this.formGroup.get(this.config.key).valid;
    }
    else{
      return false;
    }
  }

  showSubForms(){
    console.log("showSubForms clicked for", this.config.key);
    for (let sfkey of this.config.subforms){
      console.log("Got subform for", sfkey);
      this.dfs.showSubForm(sfkey);
    }
  }

  getErrors(){
    if (this.formGroup !== undefined){
      return this.formGroup.get(this.config.key).errors;
    }
    else{
      return undefined;
    }
  }

}
