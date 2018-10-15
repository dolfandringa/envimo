import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup, FormBuilder }   from '@angular/forms';
import { FormConfig } from './models/form-config.interface';
import { DynamicFormService } from './dynamic-form.service';
import { BaseFieldComponent } from './fields/basefield.component';
import { ChangeDetectorRef } from '@angular/core';
 

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentInit, OnChanges{

  @Input() datasetSchema: object;
  @Input() formName: string;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();

  payLoad: string;
  formGroup: FormGroup;
  config: FormConfig;
  checkNeeded: boolean;
  fields: {[s: string]: BaseFieldComponent} = {};

  constructor(
    public dfs: DynamicFormService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
  }

  addField(field: BaseFieldComponent){
    this.fields[field.key] = field;
    let req_fields = Object.keys(this.config.fields).length;
    let present_fields = Object.keys(this.fields).length;
    console.log("Added field",present_fields, 'of', req_fields);
    console.log('Finalizing field', field);
    this.fields[field.key].loadFinalize();
    this.fields[field.key].valueChanges.subscribe(val => {
      console.log("Value for",this.fields[field.key], "changed to", val);
      this.checkConditions();
    });
    this.checkNeeded = true; 
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
    this.fields =  {};
    this.ngOnInit();
    /*if(this.formGroup !== undefined){
      this.formGroup.reset();
    }
     */
    //this.ngAfterViewInit()
    this.cdRef.detectChanges();
  }

  toText(){
    if(this.fields){
      let str: string[]= [];
      for(let fkey in this.fields){
        let field = this.fields[fkey];
        str.push(field.toText());
      }
      return str.join(', ');
    }
  }

  createFormGroup(fields) {
    const group = this.fb.group({});
    fields.forEach(field => {
      if(field.fieldType == 'fieldset'){
        let subgroup = this.createFormGroup(field.fields);
        group.addControl(field.key, subgroup);
      }
      else{
        group.addControl(field.key, this.fb.control(field.value, field.validators || []));
      }
    });
    return group;
  }

  clearRequiredConditionalFields() {
    for (let condition of this.config.oneOf){
      for(let fname in condition.conditional_fields){
        let field = condition.conditional_fields[fname];
        let validators = field.validators;
        const idx = validators.indexOf(Validators.required);
        if(idx>-1){
          validators.splice(idx, 1);
        }
        console.log('Setting validators for field', field, 'in FormGroup.controls', this.formGroup.controls);
        let control = this.formGroup.get(field.key);
        if (control != null){
          control.setValidators(validators);
        }
      }
    }

  }

  getField(fname){
    for(let field of this.config.fields){
      if (field.key == fname){
        return field;
      }
    }
  }

  setFieldRequired(fname) {
    console.log('Setting field', fname, 'as required');
    let validators = this.getField(fname).validators;
    const idx = validators.indexOf(Validators.required);
    if(idx==-1){
      validators.push(Validators.required);
    }
    this.formGroup.get(fname).setValidators(validators);
  }

  checkConditions(){
    for (let condition of this.config.oneOf){
      console.log("Removing conditional fields"); 
      for (let field of condition.conditional_fields){
        const idx = this.config.fields.indexOf(field);
        if(idx>-1){
          this.config.fields.splice(idx, 1);
        }
        if(field.key in this.formGroup.controls){
          this.formGroup.removeControl(field.key);
        }
      }
      console.log('Checking condition', condition);
      let condition_met = true;
      for (let fname in condition.allowed_values){
        if(this.fields[fname] == undefined){
          condition_met = false;
          continue;
        }
        let val = this.fields[fname].value;
        if(condition.allowed_values[fname].indexOf(val)==-1){
          console.log(val,' is not on the allowed values', condition.allowed_values[fname]);
          condition_met = false;
        }
      }
      if(condition_met){
        console.log('All conditions have been met');
        for (let field of condition.conditional_fields){
          console.log('Adding field', field);
          this.config.fields.push(field);
          this.formGroup.addControl(field.key, this.fb.control(field.value || null, field.validators || []));
        }
        this.clearRequiredConditionalFields();
        for (let fname of condition.required){
          this.setFieldRequired(fname);
        }
      }
    }
  }

    /*setConditions(){
    for (let condition of this.config.oneOf){
      for (let fname in condition.allowed_values){
        this.fields[fname].valueChanges.subscribe(val => {
          console.log("Value for",this.fields[fname], "changed to", val);
          this.checkConditions();
        });
      }
    }
  }*/


  ngOnInit() {
    console.log("Dynamic form OnInit");
    console.log('Form name', this.formName);
    this.config = this.dfs.mapJSONSchema(this.datasetSchema)[this.formName];
    console.log('Got config', this.config);
    this.formGroup = this.createFormGroup(this.config.fields);
    console.log("Done with form OnInit");
    this.formGroup.valueChanges.subscribe(val => {
      console.log('Form value changed to', val);
      console.log('Valid?',this.formGroup.valid);
      console.log('FormGroup', this.formGroup);
    });
  }

  onSubmit() {
    if(this.valid){
      this.payLoad = this.toText();
      this.valueChanged.emit(this);
      console.log("Form value", this.value);
    }
  }

  finalizeFields(){
    for(let fname in this.fields){
      let field = this.fields[fname];
      console.log('Finalizing field loading for field', fname);
      field.loadFinalize();
    }
  }

  ngAfterViewInit() {
    console.log('AfterViewInit dynamic form component with fields', this.fields);
    //this.setConditions();
  }

  ngAfterViewChecked() {
    if(this.checkNeeded){
      this.checkConditions();
      this.checkNeeded = false;
    }
    this.cdRef.detectChanges();
  }

  ngAfterContentInit() {
    console.log('AfterContentInit')
  }

  ngOnChanges(changes) {
    console.log('ngOnChanges', changes)
  }

}
