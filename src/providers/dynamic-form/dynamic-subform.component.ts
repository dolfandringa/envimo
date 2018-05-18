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
  formgroup: FormGroup;

  constructor(params: NavParams) { 
    this.form = params.get('form');
  }

  ngOnInit() {
    this.formgroup = this.form.toFormGroup();
    this.onChanges();
  }

  onChanges() {
    console.log(this.formgroup.controls);
    for(const field in this.formgroup.controls){
      console.log(this.formgroup.get(field).errors);
    }
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.formgroup.value);
  }

}
