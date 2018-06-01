import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { EnviMo } from './app.component';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';

import { PageService } from '../providers/page-service/page-service';

import { SocketIoModule } from 'ng-socket-io';
import { StorageService } from '../providers/storage-service/storage-service';

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
  ]
})
export class AppModule {
  constructor() {
  }
}
