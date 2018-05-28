import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';
import { ReactiveFormsModule }          from '@angular/forms';

import { IonImageInputModule } from '../ion-image-input/ion-image-input.module';

import { BaseFieldComponent } from './fields/basefield.component';
import { StringFieldComponent } from './fields/stringfield.component';
import { SelectFieldComponent } from './fields/selectfield.component';
import { MultipleSelectFieldComponent } from './fields/multipleselectfield.component';
import { ImageFieldComponent } from './fields/imagefield.component';
import { DateTimeFieldComponent } from './fields/datetimefield.component';
import { IntegerFieldComponent } from './fields/integerfield.component';
import { NumberFieldComponent } from './fields/numberfield.component';

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
    DynamicSubFormComponent,
  ]
})
export class DynamicFormModule {
}
