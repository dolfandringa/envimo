import { Component, OnInit } from '@angular/core';
import { FormGroup }   from '@angular/forms';
import { LoadingController } from 'ionic-angular';

import { DynamicForm }   from './dynamic-form';
import { DynamicFormService } from './dynamic-form.service';
 

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit{


  payLoad: string;
  datasets: object = {};
  currentForm: DynamicForm;
  formGroup: FormGroup;
  form: DynamicForm;
  formsAvailable: boolean = false;
  value: any;

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
      this.form.valueChanged.subscribe((form) => {
        console.log("Form",form.key,"changed value to",form.toText());
      });
      this.formGroup = this.form.toFormGroup();
      console.log("Current form", this.form);
      console.log("Formgroup: ", this.formGroup);
      for (let sfkey in this.form.subforms){
        let subform = this.form.subforms[sfkey];
        this.dfs.addSubForm(sfkey, {form: subform})
        subform.valueChanged.subscribe((subform) => {
          console.log("Subform", subform.key, "value changed to", subform.value);
          this.form.updateSubformValues(subform);
        })
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
    if(this.formGroup.valid){
      this.payLoad = JSON.stringify(this.form.value);
      this.value = this.form.value;
      this.form.submitted = true;
      this.form.valueChanged.next(this.form);
      console.log("Form value", this.value);
    }
  }

}
