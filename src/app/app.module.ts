import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { EnviMo } from './app.component';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';

import { PageService } from '../providers/page-service/page-service';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { StorageService } from '../providers/storage-service/storage-service';

//const config: SocketIoConfig = { url: 'http://127.0.0.1:8080', options: {} };
const config: SocketIoConfig = { url: 'http://10.99.226.191:8080', options: {} };
//const config: SocketIoConfig = { url: 'http://127.0.0.1:8080', options: {transports: ['websocket','polling']} };
//const config: SocketIoConfig = { url: 'http://127.0.0.1:8080', options: {} };

@NgModule({
  declarations: [
    EnviMo,
    HomePage,
    ListPage,
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    IonicStorageModule.forRoot(),
    DynamicFormModule,
    IonicModule.forRoot(EnviMo),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EnviMo,
    HomePage,
    ListPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage,
    StorageService,
    PageService,
  ]
})
export class AppModule {
  constructor() {
  }
}
