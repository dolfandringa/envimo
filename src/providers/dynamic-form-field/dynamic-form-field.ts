import { FormControl, ValidatorFn } from '@angular/forms';

export class FieldBase {
  subforms: string[];
  value: any;
  key: string;
  label: string;
  validators: ValidatorFn[];
  order: number;
  options: object[];
  controlType: string;
  formControl: FormControl;

  constructor(options: {
    value?: any,
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    validators?: ValidatorFn[],
    controlType?: string,
    subforms?: string[]
  } = {}){
    console.log('options', options);
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.validators = options.validators === undefined ? [] : options.validators;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.subforms = options.subforms === undefined ? [] : options.subforms;
  }

  toFormControl(){
    let val = this.value !== undefined? this.value : '';
    console.log("Creating formcontrol with value", val);
    this.formControl = new FormControl(val, this.validators);
    this.formControl.valueChanges.subscribe((value) => {
      console.log('Value for field', this.key, 'changed to', value);
      this.value = value;
    });
    return this.formControl;
  }
}
