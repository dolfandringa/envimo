import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { EnviMo } from './app.component';
import { Base64 } from '@ionic-native/base64';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { FilePath } from '@ionic-native/file-path';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Geolocation } from '@ionic-native/geolocation';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { ProgressBarModule } from '../progress-bar/progress-bar.module';
import { OfflineMapModule } from '../offlinemap/offlinemap.module';

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
    ProgressBarModule,
    OfflineMapModule,
    DynamicFormModule.forRoot(),
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
    StorageService,
    PageService,
    Network,
    File,
    FilePath,
    SocialSharing,
    Geolocation,
    Base64,
    Device,
  ]
})
export class AppModule {
  constructor() {
  }
}
