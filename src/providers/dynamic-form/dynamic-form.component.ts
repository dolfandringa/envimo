import { Component, Input, OnInit } from '@angular/core';
import { FormGroup }                from '@angular/forms';

import { FieldBase }                from '../fields/field-base';
import { FieldService }             from '../fields/field.service';
 

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ FieldService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() fields: FieldBase<any>[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private fs: FieldService) { }

  ngOnInit() {
    this.form = this.fs.toFormGroup(this.fields);
    this.onChanges();
  }

  onChanges() {
    console.log(this.form.controls);
    for(const field in this.form.controls){
      console.log(this.form.get(field).errors);
    }
  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }

}
