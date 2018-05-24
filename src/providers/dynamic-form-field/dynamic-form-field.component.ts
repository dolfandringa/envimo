import { Component, Input, OnInit } from '@angular/core';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { FormGroup }   from '@angular/forms';
 
import { FieldBase }     from './base';

@Component({
  selector: 'app-field',
  templateUrl: './dynamic-form-field.component.html'
})
export class DynamicFormFieldComponent implements OnInit{

  @Input() field: FieldBase;
  @Input() formGroup: FormGroup;
  hasSubForms: boolean;

  constructor(
    public dfs: DynamicFormService,
  ) {}

  ngOnInit(){
    console.log("field", this.field);
    this.hasSubForms = this.field.subforms.length>0;
  }

  showSubForms(){
    console.log("showSubForms clicked for", this.field);
    for(let sfkey of this.field.subforms){
      console.log("Got subform", sfkey);
      this.dfs.showSubForm(sfkey);
    }
  }

  getPicture(){
    console.log("Clicked for field", this.field);
    this.field.camera.getPicture(this.field.cameraoptions).then((imageData) => {
      console.log('Got picture', imageData);
    });
  }

  get isValid() { 
    let valid = this.formGroup.controls[this.field.key].valid;
    console.log("Current field valid?", valid);
    return valid; 
  }

}
