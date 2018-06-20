import { ValidatorFn, AbstractControl } from '@angular/forms';



export function IntegerValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if(control.value == null || control.value === undefined){
      return null;
    }
    if(/^$/.test(control.value)){
      return null;
    }
    return /^-?[0-9]+$/.test(control.value) ? null : {'notInteger': {value: control.value}};  
  }
}
