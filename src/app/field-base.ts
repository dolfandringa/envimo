import { ValidatorFn } from '@angular/forms';

export class FieldBase<T> {
  value: T;
  key: string;
  label: string;
  validators: ValidatorFn[];
  order: number;
  controlType: string;

  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    validators?: ValidatorFn[],
    controlType?: string
  } = {}){
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.validators = options.validators === undefined ? [] : options.validators;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
  }
}
