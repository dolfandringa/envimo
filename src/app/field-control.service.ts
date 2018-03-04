import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FieldBase } from './field-base';

@Injectable()
export class FieldControlService {

  constructor() { }

	toFormGroup(fields: FieldBase<any>[] ) {
  	let group: any = {};

    fields.forEach(field => {
      group[field.key] = new FormControl(field.value || '', Validators.compose(field.validators));
      group[field.key].valueChanges.subscribe(value => {
        console.log(group[field.key].errors);
      });
    });
    return new FormGroup(group);
  }

}
