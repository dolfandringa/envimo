import { ValidatorFn, AbstractControl } from '@angular/forms';



export function IntegerValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    return /^-?[0-9]+$/.test(control.value) ? null : {'notInteger': {value: control.value}};  
  }
}
