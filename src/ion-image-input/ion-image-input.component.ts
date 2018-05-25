import { Component, Input, forwardRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';

/**
 * Generated class for the IonImageInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ion-image-input',
  templateUrl: 'ion-image-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonImageInputComponent),
      multi: true
    }
  ]
})
export class IonImageInputComponent implements ControlValueAccessor {

  @Input()
  _imageData: string;

  constructor(
    private imagePicker: ImagePicker,
    private base64: Base64,
    private domSanitizer: DomSanitizer
  ) { }

  propagateChange = (_: any) => {};

  get imageData(){
    return this._imageData;
  }

  set imageData(val){
    this._imageData = val.replace(/[\r\n]+/g, '');
    this.propagateChange(this._imageData);
  }

  writeValue(value: any) {
    this.imageData = value;
  }

  registerOnTouched() {}

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  
  getPicture(){
    console.log("Button clicked");
    this.imagePicker.getPictures({maximumImagesCount: 1}).then((results) => {
      for (let i = 0; i < results.length; i++) {
        console.log(results[i]);
        this.base64.encodeFile(results[i]).then((base64File: string) => {
          console.log("Original Base64 version:", base64File);
          this.imageData = base64File;
          console.log("Modified Base64 version:", this.imageData);
          this.propagateChange(this.imageData);
        }, (err) => { 
          console.log(err); 
        });
      }
    }, (err) => {});
  }

}
