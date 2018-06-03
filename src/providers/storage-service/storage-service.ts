import { Injectable, Injector } from '@angular/core';
import { SocketIoConfig, Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';
import { Subject }    from 'rxjs';
import "rxjs/add/operator/takeWhile";
import { environment } from '@environment';


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
  newTokenAvailable = new Subject<null>();
  dataSaved = new Subject<null>();
  connected = new Subject<null>();
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
  }

  stopSocket(){
    this.socket_active = false;
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
    this.getJWT().then((jwt) => {
      if(jwt === undefined || jwt == null){
        let message = "No token defined yet. Please login first.";
        this.JWTLoginError.next(message);
        console.info(message);
        return;
      }
      console.log("Creating socket with jwt", jwt);
      let injector = Injector.create([{
        provide: Socket,
        useFactory:createSocket(jwt),
        deps: []}])
      this.socket = injector.get(Socket);
      this.connectSocket();    
    });

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
    this.socket.connect();
  }

  setJWT(token) {
    return this.storage.set('JWT', token);
  }

  getJWT() {
    return this.storage.get('JWT');
  }

  storeDatasets(datasets) {
    console.log('Storing datasets', datasets);
    this.storage.set('datasets', datasets).then(() => {
      console.log("Finished storing datasets");
      this.newDatasetsAvailable.next();
    });
  }

  storeData(datasetname, formname, data) {
    console.log('Storing submitted data for dataset',datasetname,'and form',formname,':', data);
    this.storage.get('dataQueue').then((dataQueue: any[]) => {
      let item = {datasetname: datasetname, formname: formname, data: data};
      console.log("Pushing item onto dataQueue:", item);
      dataQueue.push(item);
      this.storage.set('dataQueue', dataQueue).then(() => {
        console.log('Data saved successfully');
        this.dataSaved.next();
      });
    });
    return this.dataSaved;
  }

  getDatasets() {
    return this.storage.get('datasets');
  }


}
