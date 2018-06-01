import { Injectable, Injector } from '@angular/core';
import { SocketIoConfig, Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';
import { Subject }    from 'rxjs';


/*
  Generated class for the StorageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
 */

class MySocketService extends Socket {
  //const config: SocketIOConfig;
//const config: SocketIoConfig = { url: 'http://127.0.0.1:8080', options: {} };
//const config: SocketIoConfig = { url: 'http://10.99.226.191:8080', options: {} };
//const config: SocketIoConfig = { url: 'http://127.0.0.1:8080', options: {transports: ['websocket','polling']} };
//const config: SocketIoConfig = { url: 'http://127.0.0.1:8080', options: {} };
  constructor(jwt: string){
    let config: SocketIoConfig = {url: 'http://127.0.0.1:8080', options: {query: {token: jwt}}}
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
  connected = new Subject<null>();
  private _connected: boolean = false;
  private _connectionInProgress: boolean = false;
  private socket: Socket;

  constructor(
    private storage: Storage,
  ) {
    console.log('StorageService starting');
    this.createSocket();
  }

  createSocket(){
    console.log("Creating websocket.");
    if(this._connected){
      console.log("Already connected. Not creating a new connection.");
      return
    }
    if(this._connectionInProgress){
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
    this.socket.on('connect', () => {
      console.log('Connected');
      this._connected = true;
      this._connectionInProgress = false;
      this.connected.next();
    });
    this.socket.on("disconnect", () => {
      console.info("Connection closed.");
      this._connected = false;
      this._connectionInProgress = false;
    });
    this.socket.on("reconnect_failed", (data) => {
      console.info("Reconnection attmept failed");
      this._connected = false;
      this._connectionInProgress = false;
    });
    this.socket.on("connect_failed", (data) => {
      console.error("Connection failed", data);
      this._connected = false;
      this._connectionInProgress = false;
      this.JWTLoginError.next(data);
    });
    this.socket.fromEvent("newDatasets").subscribe((datasets) => {
      console.log("Got new datasets", datasets);
      this.storeDatasets(datasets);
    });
    this.socket.fromEvent("newToken").subscribe((token) => {
      console.log('Got new token', token);
      this.storage.set('JWT', token).then(() => {
        this.newTokenAvailable.next();
      });
    });
    this._connectionInProgress = true;
    this.socket.connect();
  }

  setJWT(token){
    return this.storage.set('JWT', token);
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
