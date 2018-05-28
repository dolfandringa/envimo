import { ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { StringFieldComponent } from './fields/stringfield.component';
import { SelectFieldComponent } from './fields/selectfield.component';
import { MultipleSelectFieldComponent } from './fields/multipleselectfield.component';
import { ImageFieldComponent } from './fields/imagefield.component';
import { DateTimeFieldComponent } from './fields/datetimefield.component';
import { IntegerFieldComponent } from './fields/integerfield.component';
import { NumberFieldComponent } from './fields/numberfield.component';


const components = {
  imagefield: ImageFieldComponent,
  selectfield: SelectFieldComponent,
  multipleselectfield: MultipleSelectFieldComponent,
  stringfield: StringFieldComponent,
  integerfield: IntegerFieldComponent,
  numberfield: NumberFieldComponent,
  datetimefield: DateTimeFieldComponent,
}

@Directive({
  selector: '[dynamicField]',
})
export class DynamicFieldDirective implements OnInit {
  @Input() config;
  @Input() formGroup: FormGroup;
  component;
  
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  ngOnInit() {
    console.log("DynamicFieldDirective fieldType:",this.config.fieldType);
    const component = components[this.config.fieldType];
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.formGroup = this.formGroup;
    console.log("Component", this.component);
    console.log("Component instance", this.component.instance);
  }
}
