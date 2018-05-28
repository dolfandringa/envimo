import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder }   from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { FormConfig } from './models/form-config.interface';
import { DynamicFormService } from './dynamic-form.service';

 

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit{

  @Input() config: FormConfig;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();

  payLoad: string;
  formGroup: FormGroup;

  constructor(
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    public dfs: DynamicFormService,
  ) {
  }

  get value(): any{
    if (this.formGroup !== undefined){
      return this.formGroup.value;
    }
    else{
      return undefined;
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
    let str: string[]= [];
    for(let fkey in this.config.fields){
      let field = this.config.fields[fkey];
      str.push(field.key);
      //str.push(field.toText());
    }
    return str.join(', ');
  }

  createFormGroup() {
    const group = this.fb.group({});
    console.log("fields: ", this.config.fields);
    this.config.fields.forEach(field => {
      console.log("field: ", field.key);
      group.addControl(field.key, this.fb.control(field.value || '', field.validators || []));
    });
    return group;
  }


  ngOnInit() {
    this.formGroup = this.createFormGroup();
    for(let sfkey in this.config.subforms){
      this.dfs.addSubForm(sfkey, this.config.subforms[sfkey]);
    }
  }

  onSubmit() {
    if(this.valid){
      this.payLoad = JSON.stringify(this.value);
      this.valueChanged.emit(this);
      console.log("Form value", this.value);
    }
  }

}