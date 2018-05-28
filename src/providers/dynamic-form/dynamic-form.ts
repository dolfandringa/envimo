import { FieldBase } from '../dynamic-form-field/dynamic-form-field';
import { FormGroup }   from '@angular/forms';
import { Subject } from "rxjs/Subject";

export class DynamicForm {

  subforms: { [s: string]: DynamicForm; } = {};
  formGroup: FormGroup;
  submitted: boolean = false;
  public valueChanged: Subject<DynamicForm>;
  
  constructor(public key: string, public title:string, public fields: FieldBase[]){
    this.valueChanged = new Subject<DynamicForm>();
  }

  get value(){
    return this.formGroup.value;
  }

  reset(){
    if(this.formGroup !== undefined){
      this.formGroup.reset();
    }
  }

  toText(){
    let str="";
    for(let fkey in this.fields){
      let field = this.fields[fkey];
      if(field.controlType == 'imageupload'){
        str = str+'<img src="' + field.value + '" width="50px" />'
      }
      else{
        str = str+', '+field.label+': '+field.value;
      }

    }
    return str;
  }


  updateSubformValues(subform){
    console.log("Updating values for subform", subform.key);
    console.log("Fields:", this.fields);
    for (let field of this.fields) {
      console.log("subforms for field",field.key,":",field.subforms);
      if(field.subforms.indexOf(subform.key)>-1){
        console.log("Field controlType", field.controlType);
        if(field.controlType=='multipledropdown'){
          let option = {id: subform.value, label: subform.toText()}
          console.log("Updating multipledropdown options for",field.key," and adding", option);
          console.log("Field value:", field.value);
          console.log("Form control value:", field.formControl.value);
          console.log("Form control value through formgroup:", this.formGroup.get(field.key).value);
          field.options.push(option);
          console.log("Pushed option");
          console.log("Field value:", field.value);
          console.log("Form control value:", field.formControl.value);
          console.log("Form control value through formgroup:", this.formGroup.get(field.key).value);
          this.formGroup.get(field.key).value.push(subform.value);
          console.log("Pushed value");
          console.log("Field value:", field.value);
          console.log("Form control value:", field.formControl.value);
          console.log("Form control value through formgroup:", this.formGroup.get(field.key).value);
        }
        else{
          console.log("Updating value for field", field.label, "from subform to", subform.value);
          this.formGroup.get(field.key).setValue(subform.value);
        }
        console.log("Form value",this.formGroup.value);
      }
    }
  }

  toFormGroup() {
  	let group = {};
    console.log("fields: ", this.fields);
    this.fields.forEach(field => {
      console.log("field: ", field.key);
      group[field.key] = field.toFormControl();
    });
    this.formGroup = new FormGroup(group);
    return this.formGroup;
  }

}


