import { Component, Input, OnInit } from '@angular/core';
import { FormGroup }                 from '@angular/forms';

import { FieldBase }              from '../fields/field-base';
import { FieldControlService }    from '../fields/field-control.service';
 

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [ FieldControlService ]
})
export class DynamicFormComponent implements OnInit {

  @Input() fields: FieldBase<any>[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private fcs: FieldControlService) { }

  ngOnInit() {
    this.form = this.fcs.toFormGroup(this.fields);
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
