import { ValidatorFn } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

export class FieldBase {
  subforms: string[];
  value: any;
  key: string;
  camera: Camera;
  cameraoptions: CameraOptions;
  label: string;
  validators: ValidatorFn[];
  order: number;
  controlType: string;

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
}
