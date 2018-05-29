import { FormGroup }   from '@angular/forms';
import { OnInit } from '@angular/core';
import { FieldConfig } from '../models/field-config.interface';
import { FormConfig } from '../models/form-config.interface';
import { DynamicFormComponent } from '../dynamic-form.component';

export interface Field extends OnInit{
  config: FieldConfig;
  formGroup: FormGroup;
  hasSubForms: boolean;
  subForms: {[s: string]: FormConfig};
  addSubForms();
  toText(): string;
  showSubForms();
  valid: boolean;
  showSubForms();
  errors: object;
  key: string;
  modals: {};
  value: any;
  updateSubFormValues(form: DynamicFormComponent);
}

