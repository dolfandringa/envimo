import { Component, OnInit } from '@angular/core';
import { FormGroup }   from '@angular/forms';
import { LoadingController } from 'ionic-angular';

import { DynamicForm }   from './base';
import { DynamicFormService } from './dynamic-form.service';
 

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit{


  payLoad = '';
  datasets: object = {};
  currentForm: DynamicForm;
  formGroup: FormGroup;
  form: DynamicForm;
  formsAvailable: boolean = false;

  constructor(
    public dfs: DynamicFormService,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.dfs.getDatasets().subscribe(data => {
      console.log("newDatasets triggered");
      console.log("Loading form");
      this.datasets = data;
      console.log("Got datasets", this.datasets);
      //let fields = this.dfs.getFields();
      //this.currentForm = new DynamicForm('observation', 'Add Observation', fields);
      this.form = this.datasets['Pawikan']['Encounter'];
      this.formGroup = this.form.toFormGroup();
      console.log("Current form", this.form);
      console.log("Formgroup: ", this.formGroup);
      for (let sfkey in this.form.subforms){
        this.dfs.addSubForm(sfkey, {form: this.form.subforms[sfkey]});
      }
      this.formsAvailable = true;
    });
  }

  onChanges() {
    if (this.formsAvailable){
      console.log(this.formGroup.controls);
      for(const field in this.formGroup.controls){
        console.log(this.formGroup.get(field).errors);
      }
    }
  }
  
  onSubmit() {
    this.payLoad = JSON.stringify(this.formGroup.value);
  }

}
