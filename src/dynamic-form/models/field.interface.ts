import { FormGroup }   from '@angular/forms';
import { OnInit } from '@angular/core';
import { FieldConfig } from '../models/field-config.interface';
import { FormConfig } from '../models/form-config.interface';

export interface Field extends OnInit{
  config: FieldConfig;
  formGroup: FormGroup;
  hasSubForms: boolean;
  subForms: {[s: string]: FormConfig};
  addSubForms();
  showSubForms();
  valid: boolean;
  showSubForms();
  errors: object;
  modals: {};
}

