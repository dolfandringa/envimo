import { ComponentFactoryResolver, ComponentRef, Directive, Input, AfterViewInit, OnChanges, OnDestroy, OnInit, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { StringFieldComponent } from './fields/stringfield.component';
import { SelectFieldComponent } from './fields/selectfield.component';
import { MultipleSelectFieldComponent } from './fields/multipleselectfield.component';
import { ImageFieldComponent } from './fields/imagefield.component';
import { DateTimeFieldComponent } from './fields/datetimefield.component';
import { IntegerFieldComponent } from './fields/integerfield.component';
import { NumberFieldComponent } from './fields/numberfield.component';
import { FieldSetComponent } from './fields/fieldset.component';
import { LocationFieldComponent } from './fields/locationfield.component';
import { SubFormFieldComponent } from './fields/subformfield.component';
import { BooleanFieldComponent } from './fields/booleanfield.component';
import { TextAreaFieldComponent } from './fields/textareafield.component';
import { RadioFieldComponent } from './fields/radiofield.component';

import { FieldConfig } from './models/field-config.interface';
import { Field } from './models/field.interface';
import { FormConfig } from './models/form-config.interface';


const components = {
  imagefield: ImageFieldComponent,
  selectfield: SelectFieldComponent,
  multipleselectfield: MultipleSelectFieldComponent,
  stringfield: StringFieldComponent,
  integerfield: IntegerFieldComponent,
  numberfield: NumberFieldComponent,
  datetimefield: DateTimeFieldComponent,
  fieldset: FieldSetComponent,
  locationfield: LocationFieldComponent,
  subformfield: SubFormFieldComponent,
  booleanfield: BooleanFieldComponent,
  textareafield: TextAreaFieldComponent,
  radiofield: RadioFieldComponent,
}

@Directive({
  selector: '[dynamicField]',
})
export class DynamicFieldDirective implements AfterViewInit, OnInit, OnChanges, OnDestroy{
  @Input() config: FieldConfig;
  @Input() formGroup: FormGroup;
  @Input() subForms: {[s: string]: FormConfig}
  @Output() fieldAdded: EventEmitter<any> = new EventEmitter<any>();
  component: ComponentRef<Field>;
  
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
  ) {}

  ngOnChanges() {
    if(this.component){
      this.component.instance.config = this.config;
      this.component.instance.formGroup = this.formGroup;
      this.component.instance.subForms = this.subForms;
    }
  }

  ngOnDestroy(){
    console.log('Running destroy on directive');
    console.log("this.component", this.component);
    this.component.destroy();
    this.container.clear();
  }

  ngOnInit() {
		if (!components[this.config.fieldType]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(
        `Trying to use an unsupported type (${this.config.fieldType}).
        Supported types: ${supportedTypes}`
      );
    }
    console.log('Running ngOnInit for fieldType', this.config.fieldType);
    const component = components[this.config.fieldType];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.formGroup = this.formGroup;
    this.component.instance.subForms = this.subForms;
  }

  ngAfterViewInit(){
    console.log("Directive AfterViewinit");
    this.fieldAdded.emit(this.component.instance);
  }
}
