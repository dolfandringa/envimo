import { Component, OnInit } from '@angular/core';
import { FormGroup }   from '@angular/forms';
import { FieldConfig } from '../models/field-config.interface';
import { FormConfig } from '../models/form-config.interface';
import { OptionConfig } from '../models/option-config.interface';
import { Field } from '../models/field.interface';
import { DynamicSubFormComponent } from '../dynamic-subform.component';
import { DynamicFormComponent } from '../dynamic-form.component';
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'base-field',
  template: `
<ion-item>
  <p item-content>Not Implemented</p>
</ion-item>
  `
})
export class BaseFieldComponent implements Field, OnInit{

  config: FieldConfig;
  formGroup: FormGroup;
  subForms: {[s: string]: FormConfig };
  modals: {};

  constructor(
    private modalCtrl: ModalController,
  ) {}

  get hasSubForms(): boolean{
    return this.config.subforms !== undefined && this.config.subforms.length>0;
  }

  get key(): string{
    return this.config.key;
  }

  get value(): any{
    return this.formGroup.get(this.key).value;
  }

  set value(val: any){
    this.formGroup.get(this.key).setValue(val);
  }

  toText(): string{
    return this.key+': '+this.value
  }

  get valid(): boolean{
    if (this.formGroup !== undefined){
      return this.formGroup.get(this.key).valid;
    }
    else{
      return false;
    }
  }

  get errors(){
    if (this.formGroup !== undefined){
      return this.formGroup.get(this.key).errors;
    }
    else{
      return undefined;
    }
  }

  updateSubFormValues(form: DynamicFormComponent){
    console.log("Old field:", this);
    console.log("Old field value:", this.value);
    if(this.value instanceof Array){
      let option: OptionConfig = {id: form.value, label: form.toText(), selected: true};
      console.log("Adding option:", option);
      this.config.options.push(option);
      console.log("Adding value:", form.value);
      this.value.push(form.value);
    }
    else{
      this.value = form.value;
    }
    console.log("Updated field:", this);
    console.log("Updated field value:", this.value);
  }

  addSubForms() {
    console.log("AddSubForms fieldconfig",this.config);
    if(this.config.subforms !== undefined){
      this.config.subforms.forEach(sfkey =>{
        let sfconfig = this.subForms[sfkey];
        console.log("Adding subform",sfkey,"with config",sfconfig);
        let modal = this.modalCtrl.create(DynamicSubFormComponent, {'formconfig': sfconfig}, {showBackdrop: false});
        this.modals[sfkey] = modal;
        modal.onDidDismiss(form => {
          if(form){
            console.log("Subform",form.key,"closed with data",form.value," and label",form.toText());
            this.updateSubFormValues(form);
          }
        });
      });
    }
  }

  showSubForms(){
    console.log("showSubForms clicked for", this.key);
    if(this.config.subforms !== undefined){
      this.config.subforms.forEach(sfkey => {
        console.log("Got subform for", sfkey);
        console.log("Modal",this.modals[sfkey]);
        this.modals[sfkey].present();
      });
    }
  }

  loadFinalize() {
    console.log('BaseField load finalize');
  }

  ngOnInit(){
    console.log("OnInit field", this.config.key);
    this.modals = {};
    this.addSubForms();
  }

}
