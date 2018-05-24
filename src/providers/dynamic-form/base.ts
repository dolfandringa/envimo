import { FieldBase } from '../dynamic-form-field/base';
import { FormControl, FormGroup }   from '@angular/forms';

export class DynamicForm {

  subforms: { [s: string]: DynamicForm; } = {};
  
  constructor(public key: string, public title:string, public fields: FieldBase[]){
  }


  toFormGroup() {
  	let group = {};
    console.log("fields: ", this.fields);
    this.fields.forEach(field => {
      console.log("field: ", field.key);
      group[field.key] = new FormControl(field.value || '', field.validators);
      group[field.key].valueChanges.subscribe(value => {
        console.log("field: ", field.key);
        console.log("errors: ",group[field.key].errors);
      });
    });
    return new FormGroup(group);
  }

}


