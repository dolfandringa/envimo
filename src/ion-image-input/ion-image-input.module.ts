import { NgModule, ErrorHandler } from '@angular/core';
import { IonImageInputComponent } from './ion-image-input.component';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

@NgModule({
  declarations: [IonImageInputComponent],
  providers: [
    ImagePicker,
    Base64,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
	imports: [IonicModule],
  bootstrap: [IonicApp],
	exports: [IonImageInputComponent]
})
export class IonImageInputModule {}
