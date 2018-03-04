import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { FieldDropdown } from './field-dropdown';
import { FieldBase }     from './field-base';
import { FieldTextbox }  from './field-textbox';

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
        type: 'number',
        order: 2
      })
    ];

    return fields.sort((a, b) => a.order - b.order);

  }

}
