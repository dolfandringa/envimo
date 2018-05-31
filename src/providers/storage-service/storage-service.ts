import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';
import { Subject }    from 'rxjs';

/*
  Generated class for the StorageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageService {
  newDatasetsAvailable = new Subject<null>();

  constructor(
    private socket: Socket,
    private storage: Storage,
  ) {
    console.log('StorageService starting');
    this.initialize_websocket();    
  }

  initialize_websocket(){
    this.socket.on('connect', (data) => {
      console.log('Connected');
      this.socket.emit("message", "Hello World!");
    });
    console.log('Connecting to websocket');
    this.socket.fromEvent("newDatasets").subscribe((datasets) => {
      this.storeDatasets(datasets);
    });
    this.socket.connect();
  }

  getJWT() {
    return this.storage.get('JWT');
  }

  storeDatasets(datasets){
    console.log('Storing datasets', datasets);
    this.storage.set('datasets', datasets).then(() => {
      console.log("Finished storing datasets");
      this.newDatasetsAvailable.next();
    });
  }

  getDatasets(){
    return this.storage.get('datasets');
  }


}
