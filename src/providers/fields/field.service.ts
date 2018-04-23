import { Injectable } from '@angular/core';

import { FieldDropdown } from './field-dropdown';
import { FieldBase }     from './field-base';
import { FieldTextbox }  from './field-textbox';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class FieldService {

  getFields() {
    let fields: FieldBase<any>[] = [
      new FieldDropdown({
        key: 'species',
        label: 'Species',
        validators: [Validators.required],
        options: [
          {key: 'G', value: 'Green Turtle'},
          {key: 'OR', value: 'Olive Ridley Turtle'},
          {key: 'HB', value: 'Hawksbill Turtle'},
          {key: 'LH', value: 'Loggerhead Turtle'},
          {key: 'LB', value: 'Leatherback Turtle'}
        ],
        order: 1
      }),

      new FieldTextbox({
        key: 'ccl_cm',
        label: 'Curved Carapax Length (CCL) in cm',
        validators: [Validators.required, Validators.min(50), Validators.max(250)],
        type: 'text',
        order: 2
      })
    ];

    return fields.sort((a, b) => a.order - b.order);

  }
  
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
