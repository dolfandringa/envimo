import { Component } from '@angular/core';
import { FormBuilder }   from '@angular/forms';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { FormConfig } from './models/form-config.interface';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormService } from './dynamic-form.service';
 

@Component({
  templateUrl: './dynamic-subform.component.html'
})
export class DynamicSubFormComponent extends DynamicFormComponent {

  config: FormConfig;

  constructor(
    private subloadingCtrl: LoadingController,
    private subfb: FormBuilder,
    public subdfs: DynamicFormService,
    public params: NavParams,
    public viewCtrl: ViewController
  ) { 
    super(
      subloadingCtrl,
      subfb,
      subdfs
    );
    this.config = params.get('formconfig');
  }

  showSubForm(name: string){
    console.log("Nothing to see here.");
  }

  onSubmit() {
    if(this.valid){
      this.payLoad = JSON.stringify(this.value);
      this.valueChanged.emit(this);
      console.log("Subform value", this.value);
      this.viewCtrl.dismiss(this.value);
    }
  }

}
