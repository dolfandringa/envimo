import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';
import { ReactiveFormsModule }          from '@angular/forms';

import { IonImageInputModule } from '../ion-image-input/ion-image-input.module';
import { OfflineMapModule } from '../offlinemap/offlinemap.module';

import { BaseFieldComponent } from './fields/basefield.component';
import { StringFieldComponent } from './fields/stringfield.component';
import { LocationFieldComponent } from './fields/locationfield.component';
import { SelectFieldComponent } from './fields/selectfield.component';
import { MultipleSelectFieldComponent } from './fields/multipleselectfield.component';
import { ImageFieldComponent } from './fields/imagefield.component';
import { DateTimeFieldComponent } from './fields/datetimefield.component';
import { IntegerFieldComponent } from './fields/integerfield.component';
import { NumberFieldComponent } from './fields/numberfield.component';
import { FieldSetComponent } from './fields/fieldset.component';
import { SubFormFieldComponent } from './fields/subformfield.component';
import { BooleanFieldComponent } from './fields/booleanfield.component';
import { TextAreaFieldComponent } from './fields/textareafield.component';
import { RadioFieldComponent } from './fields/radiofield.component';

import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicSubFormComponent } from './dynamic-subform.component';
import { DynamicFieldDirective } from './dynamic-field.directive';

@NgModule({
  declarations: [
    BaseFieldComponent,
    StringFieldComponent,
    SelectFieldComponent,
    MultipleSelectFieldComponent,
    ImageFieldComponent,
    DateTimeFieldComponent,
    IntegerFieldComponent,
    NumberFieldComponent,
    SubFormFieldComponent,
    TextAreaFieldComponent,
    RadioFieldComponent,
    LocationFieldComponent,
    FieldSetComponent,
    BooleanFieldComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    DynamicSubFormComponent,
  ],
  providers: [
    DynamicFormService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  imports: [
    CommonModule,
    IonicModule,
    IonImageInputModule,
    OfflineMapModule,
    ReactiveFormsModule,
  ],
  exports: [
    DynamicFormComponent,
  ],
  entryComponents: [
    StringFieldComponent,
    TextAreaFieldComponent,
    SelectFieldComponent,
    MultipleSelectFieldComponent,
    ImageFieldComponent,
    DateTimeFieldComponent,
    IntegerFieldComponent,
    NumberFieldComponent,
    LocationFieldComponent,
    FieldSetComponent,
    RadioFieldComponent,
    BooleanFieldComponent,
    SubFormFieldComponent,
    DynamicSubFormComponent,
  ]
})
export class DynamicFormModule {
  static forRoot(): ModuleWithProviders{
    return {
      ngModule: DynamicFormModule,
      providers: [ DynamicFormService]
    }
  }
}
