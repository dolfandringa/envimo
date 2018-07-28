import { NgModule, ErrorHandler } from '@angular/core';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';

import { OfflineMap } from './offlinemap.component';
import { LoadingProgress } from './loading-progress.component';

import { TilesDbProvider } from './tiles-db';
//import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from '../progress-bar/progress-bar.module';

@NgModule({
  declarations: [
    OfflineMap,
    LoadingProgress
  ],
  providers: [
    TilesDbProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  entryComponents: [
    LoadingProgress
  ],
  imports: [
    IonicModule,
    HttpClientModule,
    //IonicStorageModule.forRoot({name: 'offlinemap'}),
    ProgressBarModule
  ],
	exports: [OfflineMap]
})
export class OfflineMapModule {}
