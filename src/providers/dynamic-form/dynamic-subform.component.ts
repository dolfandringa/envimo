import { Component, OnInit } from '@angular/core';
import { FormGroup }   from '@angular/forms';
import { NavParams } from 'ionic-angular';
import { DynamicForm }   from './dynamic-form';
import { ViewController } from 'ionic-angular';
 

@Component({
  templateUrl: './dynamic-subform.component.html'
})
export class DynamicSubFormComponent implements OnInit {

  form: DynamicForm;
  payLoad: string;
  formGroup: FormGroup;
  value: any;

  constructor(params: NavParams, public viewCtrl: ViewController) { 
    this.form = params.get('form');
  }

  showSubForm(name: string){
    console.log("Nothing to see here.");
  }

  ngOnInit() {
    this.formGroup = this.form.toFormGroup();
    console.log(this.viewCtrl);
    this.onChanges();
  }

  onChanges() {
    console.log(this.formGroup.controls);
    for(const field in this.formGroup.controls){
      console.log(this.formGroup.get(field).errors);
    }
  }

  onSubmit() {
    if(this.formGroup.valid){
      this.payLoad = JSON.stringify(this.form.value);
      this.value = this.form.value;
      this.form.valueChanged.next(this.form);
      console.log("Subform value", this.value);
      this.viewCtrl.dismiss(this.value);
    }
  }

}
