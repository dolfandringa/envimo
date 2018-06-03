import { Injectable, Injector } from '@angular/core';
import { SocketIoConfig, Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';
import { Subject }    from 'rxjs';
import "rxjs/add/operator/takeWhile";
import { environment } from '@environment';
import { v4 as uuidv4 } from 'uuid';


/*
  Generated class for the StorageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
 */

class MySocketService extends Socket {
  constructor(jwt: string){
    console.log("Environment", environment);
    let config: SocketIoConfig = {url: environment.backend_uri, options: {query: {token: jwt}}}
    console.log("Creating websocket with config", config);
    super(config);
  }
}

function createSocket(jwt){
  return () => {
    return new MySocketService(jwt);
  }
}

@Injectable()
export class StorageService {
  newDatasetsAvailable = new Subject<null>();
  JWTLoginError = new Subject<string>();
  uploadError = new Subject<string>();
  queueChange = new Subject<number>();
  newTokenAvailable = new Subject<null>();
  connected = new Subject<null>();
  jwt: string;
  private uploading: boolean = false;
  private socket_active: boolean = false;
  private _connected: boolean = false;
  private connectionInProgress: boolean = false;
  private socket: Socket;

  constructor(
    private storage: Storage,
  ) {
    console.log('StorageService starting');
    this.initValues();
  }

  getQueueLength(){
    return this.storage.get('dataQueue').then((queue) => {
      if(queue == null){
        this.storage.set('dataQueue', []);
        return 0;
      }
      else{
        return queue.length;
      }
    });
  }

  initValues(){
    this.storage.get('dataQueue').then((dataQueue) => {
      if (dataQueue === undefined || dataQueue == null){
        this.storage.set('dataQueue', []);
      }
    });
    this.storage.get("JWT").then((jwt) => {
      if(jwt === undefined || jwt == null){
        let message = "No token defined yet. Please login first.";
        this.JWTLoginError.next(message);
        console.info(message);
      }
      this.jwt = jwt;
    })
  }

  stopSocket(){
    this.socket_active = false;
    this.socket.removeAllListeners();
  }

  createSocket(){
    console.log("Creating websocket.");
    this.socket_active = true;
    if(this._connected){
      console.log("Already connected. Not creating a new connection.");
      return
    }
    if(this.connectionInProgress){
      console.log("Connection in progress. Not creating a new connection.");
      return
    }
    console.log("Creating socket with jwt", this.jwt);
    let injector = Injector.create([{
      provide: Socket,
      useFactory:createSocket(this.jwt),
      deps: []}])
    this.socket = injector.get(Socket);
    this.connectSocket();    
  }

  connectSocket(){
    console.log("Connecting to websocket");
    this.connectionInProgress = true;
    this.socket.fromEvent('connect')
      .takeWhile(() => this.socket_active)
      .subscribe(() => {
        console.info('Websocket connected');
        this._connected = true;
        this.connectionInProgress = false;
        this.uploadData();
        this.connected.next();
      });
    this.socket.fromEvent("reconnect_failed")
      .takeWhile(() => this.socket_active)
      .subscribe((data) => {
        console.error("Websocket reconnection attmept failed");
        this._connected = false;
        this.connectionInProgress = false;
      });
    this.socket.fromEvent("disconnect")
      .takeWhile(() => this.socket_active)
      .subscribe(() => {
        console.error("Websocket connection closed.");
        this._connected = false;
        this.connectionInProgress = false;
      });
    this.socket.fromEvent("connect_failed")
      .takeWhile(() => this.socket_active)
      .subscribe((data) => {
        console.error("Connection failed", data);
        this._connected = false;
        this.connectionInProgress = false;
        this.JWTLoginError.next("Connection failed.");
      });
    this.socket.fromEvent("reconnecting")
      .takeWhile(() => this.socket_active)
      .subscribe(() => {
        console.info("Reconnecting websocket.");
        this._connected = false;
        this.connectionInProgress = true;
      });
    this.socket.fromEvent("reconnect")
      .takeWhile(() => this.socket_active)
      .subscribe(() => {
        console.info("Connection to the socket restored.")
        this.connectionInProgress = false;
        this._connected = true;
      });
    this.socket.fromEvent("newDatasets")
      .takeWhile(() => this.socket_active)
      .subscribe((datasets) => {
        console.log("Got new datasets", datasets);
        this.storeDatasets(datasets);
      });
    this.socket.fromEvent("newToken")
      .takeWhile(() => this.socket_active)
      .subscribe((token) => {
        console.log('Got new token', token);
        this.storage.set('JWT', token).then(() => {
          this.newTokenAvailable.next();
        });
      });
    this.queueChange
      .takeWhile(() => this.socket_active)
      .subscribe((ql) => {
        console.log("Queue length changed to", ql);
        if(this._connected && !this.uploading){
          this.uploadData();
        }
      });
    this.socket.connect();
  }

  setJWT(token) {
    return this.storage.set('JWT', token);
  }

  getJWT() {
    return this.jwt;
  }

  storeDatasets(datasets) {
    console.log('Storing datasets', datasets);
    this.storage.set('datasets', datasets).then(() => {
      console.log("Finished storing datasets");
      this.newDatasetsAvailable.next();
    });
  }

  uploadData(){
    console.log("Starting data upload.");
    this.uploading = true;
    this.storage.get('dataQueue').then((dataQueue) => {
      if(dataQueue.length>0){
        let uuid = dataQueue[0];
        this.storage.get(uuid).then((item) => {
          let senditem = {
            form: item['formname'],
            dataset: item['datasetname'],
            formdata: item['data']
          }
          this.socket.emit('saveData', senditem, (result) => {
            this.uploading = false;
            console.log("Finished emitting, result:",result);
            if(result['success']){
              this.storage.get('dataQueue').then((oldQueue) => {
                let i = oldQueue.indexOf(uuid);
                console.log("Removing",uuid,", index",i,"from the old queue",oldQueue);
                oldQueue.splice(i, 1);
                console.log("New queue", oldQueue);
                this.storage.set('dataQueue', oldQueue).then(() => {
                  this.queueChange.next(oldQueue.length);
                  this.storage.remove(uuid);
                });
              }).catch((err) => {
                console.error("Failed saving dataQueue");
              });
            }
            else{
              console.error("Error uploading data:", result['message']);
              this.uploadError.next(result['message']);
            }
          });
        });
      }
      else{
        this.uploading = false;
        console.log("Nothing to upload.");
      }
    });
  }

  storeData(datasetname, formname, data) {
    return new Promise((resolve, reject) => {
      let uuid = uuidv4();
      console.log('Storing submitted data for dataset',datasetname,'and form',formname,':', data,"with uuid",uuid);
      let item = {datasetname: datasetname, formname: formname, data: data};
      this.storage.set(uuid, item).then(() => {
        this.storage.get('dataQueue').then((dataQueue: string[]) => {
          console.log("Pushing ",uuid,"onto dataQueue");
          dataQueue.push(uuid);
          this.storage.set('dataQueue', dataQueue).then(() => {
            console.log('Data saved successfully');
            this.queueChange.next(dataQueue.length);
            resolve();
          }).catch((err) => {
            console.error("Failed storing dataQueue", err);
            reject("Failed storing data in queue.");
          });
        });
      });
    });
  }

  getDatasets() {
    return this.storage.get('datasets');
  }


}
