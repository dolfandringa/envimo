import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { EnviMo } from './app.component';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { PageService } from '../providers/page-service/page-service';
import { StorageService } from '../providers/storage-service/storage-service';

import { SocketIoModule } from 'ng-socket-io';

@NgModule({
  declarations: [
    EnviMo,
    HomePage,
    ListPage,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    SocketIoModule,
    IonicStorageModule.forRoot(),
    DynamicFormModule,
    HttpClientModule,
    IonicModule.forRoot(EnviMo),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EnviMo,
    HomePage,
    ListPage,
    LoginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage,
    StorageService,
    PageService,
    Network,
  ]
})
export class AppModule {
  constructor() {
  }
}
