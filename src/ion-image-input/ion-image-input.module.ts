import { NgModule, ErrorHandler } from '@angular/core';
import { IonImageInputComponent } from './ion-image-input.component';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [IonImageInputComponent],
  providers: [
    Camera,
    File,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
	imports: [IonicModule],
  //bootstrap: [IonicApp],
	exports: [IonImageInputComponent]
})
export class IonImageInputModule {}
