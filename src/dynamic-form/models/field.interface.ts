import { DynamicFormService } from '../dynamic-form.service';
import { FormGroup }   from '@angular/forms';
import { FieldConfig } from '../models/field-config.interface';

export interface Field{
  config: FieldConfig;
  formGroup: FormGroup;
  hasSubForms: boolean;
  valid: boolean;
  showSubForms();
  getErrors();
  dfs: DynamicFormService;
}

