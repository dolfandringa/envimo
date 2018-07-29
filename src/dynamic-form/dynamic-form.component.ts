import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder }   from '@angular/forms';
import { FormConfig } from './models/form-config.interface';
import { DynamicFormService } from './dynamic-form.service';
import { BaseFieldComponent } from './fields/basefield.component';
 

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit{

  @Input() datasetSchema: object;
  @Input() formName: string;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();

  payLoad: string;
  formGroup: FormGroup;
  config: FormConfig;
  fields: {[s: string]: BaseFieldComponent} = {};

  constructor(
    public dfs: DynamicFormService,
    private fb: FormBuilder,
  ) {
  }

  addField(field: BaseFieldComponent){
    this.fields[field.key] = field;
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
        group.addControl(field.key, this.fb.control(field.value || null, field.validators || []));
      }
    });
    return group;
  }


  ngOnInit() {
    this.config = this.dfs.mapJSONSchema(this.datasetSchema)[this.formName];
    this.formGroup = this.createFormGroup(this.config.fields);
  }

  onSubmit() {
    if(this.valid){
      this.payLoad = this.toText();
      this.valueChanged.emit(this);
      console.log("Form value", this.value);
    }
  }

}
