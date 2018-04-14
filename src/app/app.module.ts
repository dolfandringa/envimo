import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }          from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { EnviMo } from './app.component';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormFieldComponent } from './dynamic-form-field/dynamic-form-field.component';

@NgModule({
  declarations: [
    EnviMo,
    HomePage,
    ListPage,
    DynamicFormComponent,
    DynamicFormFieldComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    IonicModule.forRoot(EnviMo)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EnviMo,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
  constructor() {
  }
}
