import { Component, OnInit } from '@angular/core';
import { FormGroup }   from '@angular/forms';
import { ModalController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { DynamicForm }   from './base';
import { DynamicSubFormComponent } from './dynamic-subform.component';
import { DynamicFormService } from './dynamic-form.service';
 

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit{


  payLoad = '';
  formgroup: FormGroup;
  modals = {};
  datasets: object = {};
  currentForm: DynamicForm;
  formsAvailable: boolean = false;

  constructor(
    public modalCtrl: ModalController,
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
      this.currentForm = this.datasets['Pawikan']['Encounter'];
      console.log("Current form", this.currentForm);
      this.formgroup = this.currentForm.toFormGroup();
      console.log("Formgroup: ", this.formgroup);
      for (let subform of this.currentForm.subforms){
        this.modals[subform.key] = this.modalCtrl.create(DynamicSubFormComponent, {form: subform});
      }
      this.formsAvailable = true;
    });
  }

  onChanges() {
    if (this.formsAvailable){
      console.log(this.formgroup.controls);
      for(const field in this.formgroup.controls){
        console.log(this.formgroup.get(field).errors);
      }
    }
  }
  
  onSubmit() {
    this.payLoad = JSON.stringify(this.formgroup.value);
  }

}
