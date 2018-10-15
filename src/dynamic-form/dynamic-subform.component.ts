import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder }   from '@angular/forms';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

import { FormConfig } from './models/form-config.interface';
import { DynamicFormService } from './dynamic-form.service';
import { BaseFieldComponent } from './fields/basefield.component';
//import { ImageFieldComponent } from './fields/imagefield.component';
 

@Component({
  templateUrl: './dynamic-subform.component.html',
})
export class DynamicSubFormComponent implements OnInit {

  payLoad: string;
  formGroup: FormGroup;
  config: FormConfig;
  fields: {[s: string]: BaseFieldComponent} = {};

  constructor(
    public dfs: DynamicFormService,
    private fb: FormBuilder,
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.config = params.get('formconfig');
  }

  get value(): any{
    if (this.formGroup !== undefined){
      return this.formGroup.value;
    }
    else{
      return undefined;
    }
  }

  get key(): string{
    if(this.config){
      return this.config.key;
    }
  }

  get valid(): boolean{
    if(this.formGroup !== undefined){
      return this.formGroup.valid;
    }
    else{
      return false;
    }
  }

  reset(){
    if(this.formGroup !== undefined){
      this.formGroup.reset();
    }
  }

  toText(){
    if(this.fields){
      let str: string[]= [this.config.title];
      for(let fkey in this.fields){
        let field = this.fields[fkey];
        if(typeof field == 'ImageFieldComponent'){
          str.push(field.toText());
        }
      }
      return str.join(', ');
    }
  }

  createFormGroup() {
    const group = this.fb.group({});
    this.config.fields.forEach(field => {
      console.log("Field value:",field.value);
      group.addControl(field.key, this.fb.control(field.value, field.validators || []));
    });
    return group;
  }

  addField(field: BaseFieldComponent){
    this.fields[field.key] = field;
  }

  ngOnInit(){
    this.formGroup = this.createFormGroup();
    console.log("Initialized formGroup", this.formGroup, "with value", this.formGroup.value);
  }

  onSubmit() {
    if(this.valid){
      this.payLoad = this.toText();
      //this.valueChanged.emit(this);
      console.log("Dismissing subform. Formgroup value:", this.formGroup.value);
      this.viewCtrl.dismiss(this);
    }
  }

}
