import { Component } from '@angular/core';
import { FormGroup }   from '@angular/forms';
import { FieldConfig } from '../models/field-config.interface';
import { FormConfig } from '../models/form-config.interface';
import { Field } from '../models/field.interface';
import { DynamicSubFormComponent } from '../dynamic-subform.component';
import { ModalController } from 'ionic-angular';

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
  subForms: {[s: string]: FormConfig };
  modals: {};

  constructor(
    private modalCtrl: ModalController,
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

  get errors(){
    if (this.formGroup !== undefined){
      return this.formGroup.get(this.config.key).errors;
    }
    else{
      return undefined;
    }
  }

  addSubForms() {
    console.log("AddSubForms fieldconfig",this.config);
    if(this.config.subforms !== undefined){
      this.config.subforms.forEach(sfkey =>{
        let sfconfig = this.subForms[sfkey];
        console.log("Adding subform",sfkey,"with config",sfconfig);
        let modal = this.modalCtrl.create(DynamicSubFormComponent, {'formconfig': sfconfig}, {showBackdrop: false});
        this.modals[sfkey] = modal;
      });
    }
  }

  showSubForms(){
    console.log("showSubForms clicked for", this.config.key);
    if(this.config.subforms !== undefined){
      this.config.subforms.forEach(sfkey => {
        console.log("Got subform for", sfkey);
        console.log("Modal",this.modals[sfkey]);
        //this.modals[sfkey]._component.reset();
        this.modals[sfkey].present();
      });
    }
  }

  ngOnInit(){
    console.log("This", this);
    this.modals = {};
    this.addSubForms();
  }

}
