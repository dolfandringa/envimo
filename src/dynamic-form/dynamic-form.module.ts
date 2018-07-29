import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';
import { ReactiveFormsModule }          from '@angular/forms';

import { IonImageInputModule } from '../ion-image-input/ion-image-input.module';
import { OfflineMapModule } from '../offlinemap/offlinemap.module';

import { StringFieldComponent } from './fields/stringfield.component';
import { LocationFieldComponent } from './fields/locationfield.component';
import { SelectFieldComponent } from './fields/selectfield.component';
import { MultipleSelectFieldComponent } from './fields/multipleselectfield.component';
import { ImageFieldComponent } from './fields/imagefield.component';
import { DateTimeFieldComponent } from './fields/datetimefield.component';
import { IntegerFieldComponent } from './fields/integerfield.component';
import { NumberFieldComponent } from './fields/numberfield.component';
import { FieldSetComponent } from './fields/fieldset.component';

import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicSubFormComponent } from './dynamic-subform.component';
import { DynamicFieldDirective } from './dynamic-field.directive';

@NgModule({
  declarations: [
    StringFieldComponent,
    SelectFieldComponent,
    MultipleSelectFieldComponent,
    ImageFieldComponent,
    DateTimeFieldComponent,
    IntegerFieldComponent,
    NumberFieldComponent,
    LocationFieldComponent,
    FieldSetComponent,
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
    SelectFieldComponent,
    MultipleSelectFieldComponent,
    ImageFieldComponent,
    DateTimeFieldComponent,
    IntegerFieldComponent,
    NumberFieldComponent,
    LocationFieldComponent,
    FieldSetComponent,
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
