import { Injectable } from '@angular/core';

import { FieldDropdown, FieldTextbox, FieldInteger, FieldNumber } from './field-types';
import { FieldBase }     from './field-base';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class FieldService {

  
  toFormGroup(fields: FieldBase<any>[] ) {
  	let group: any = {};
    console.log("fields: ",fields);
    fields.forEach(field => {
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
