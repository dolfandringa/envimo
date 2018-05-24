import { NgModule, ErrorHandler } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }          from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { EnviMo } from './app.component';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DynamicFormService } from '../providers/dynamic-form/dynamic-form.service';
import { DynamicSubFormComponent } from '../providers/dynamic-form/dynamic-subform.component';
import { DynamicFormComponent } from '../providers/dynamic-form/dynamic-form.component';
import { DynamicFormFieldComponent } from '../providers/dynamic-form-field/dynamic-form-field.component';

import { PageService } from '../providers/page-service/page-service';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

//const config: SocketIoConfig = { url: 'http://10.0.8.231:8080', options: {} };
const config: SocketIoConfig = { url: 'http://127.0.0.1:8080', options: {} };

class CameraMock extends Camera {
  getPicture(options){
    return new Promise((resolve, reject) => {
      resolve("file:///home/dolf/Documents/dolfandringa.jpg");
    })
  }
}

@NgModule({
  declarations: [
    EnviMo,
    HomePage,
    ListPage,
    DynamicFormComponent,
    DynamicSubFormComponent,
    DynamicFormFieldComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    ReactiveFormsModule,
    IonicModule.forRoot(EnviMo)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EnviMo,
    DynamicSubFormComponent,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    { provide: Camera, useClass: CameraMock},
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PageService,
    DynamicFormService
  ]
})
export class AppModule {
  constructor(public dfs: DynamicFormService) {
  }
}
