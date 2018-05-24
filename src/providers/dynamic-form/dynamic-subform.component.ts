import { Component, OnInit } from '@angular/core';
import { FormGroup }   from '@angular/forms';
import { NavParams } from 'ionic-angular';
import { DynamicForm }   from './base';
 

@Component({
  templateUrl: './dynamic-subform.component.html'
})
export class DynamicSubFormComponent implements OnInit {

  form: DynamicForm;
  payLoad = '';
  formGroup: FormGroup;

  constructor(params: NavParams) { 
    this.form = params.get('form');
  }

  showSubForm(name: string){
    console.log("Nothing to see here.");
  }

  ngOnInit() {
    this.formGroup = this.form.toFormGroup();
    this.onChanges();
  }

  onChanges() {
    console.log(this.formGroup.controls);
    for(const field in this.formGroup.controls){
      console.log(this.formGroup.get(field).errors);
    }
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.formGroup.value);
  }

}
