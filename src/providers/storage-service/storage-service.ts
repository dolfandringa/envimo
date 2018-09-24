import { Injectable, Injector } from '@angular/core';
import { SocketIoConfig, Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';
import { Subject }    from 'rxjs';
import "rxjs/add/operator/takeWhile";
import { environment } from '@environment';
import { Device } from '@ionic-native/device';
import { v4 as uuidv4 } from 'uuid';
import { Base64 } from '@ionic-native/base64';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Platform } from 'ionic-angular';
import { v1 as uuidv1 } from 'uuid';

declare var cordova: any;

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
  datasets: any;
  deviceID: string;

  private uploading: boolean = false;
  private socket_active: boolean = false;
  private _connected: boolean = false;
  private connectionInProgress: boolean = false;
  private socket: Socket;
  private storage: any;

  constructor(
    private base64: Base64,
    public file: File,
    public sharing: SocialSharing,
    public plt: Platform,
    private device: Device
  ) {
    console.log('StorageService starting');
    this.storage = new Storage({
      name: '__envimo',
      storeName: '_envimo',
      driverOrder: ['indexeddb', 'websql', 'localstorage']
    });

  }

  public initialize(){
    return this.initValues();
  }

  public getPathForImage(img){
    if (img === null){
      return '';
    }
    else{
      return cordova.file.dataDirectory + img;
    }
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

  loadDeviceID(){
    console.log("Loading UUID from storage");
    return this.storage.get('DeviceID').then((deviceID) => {
      console.log('Got DeviceID', deviceID);
      if(deviceID === undefined || deviceID == null){
        if(this.plt.is('cordova')){
          this.deviceID = this.device.uuid;
        }
        else{
          this.deviceID = uuidv1();
        }
        this.storage.set('DeviceID', this.deviceID);
      }
      else{
        this.deviceID = deviceID;
      }
    });

  }

  loadJWT(){
    console.log("Loading JWT from storage");
    return this.storage.get("JWT").then((jwt) => {
      console.log('Got jwt', jwt);
      console.log('Undefined?', jwt===undefined || jwt == null);
      if(jwt === undefined || jwt == null){
        let message = "No token defined yet. Please login first.";
        this.JWTLoginError.next(message);
        console.info(message);
      }
      this.jwt = jwt;
    });
  }

  loadDatasets(){
    console.log("Loading datasets from storage");
    return this.storage.get('datasets').then((datasets) => {
      this.datasets = datasets;
    });
  }

  loadDataQueue(){
    return this.storage.get('dataQueue').then((dataQueue) => {
      if (dataQueue === undefined || dataQueue == null){
        this.storage.set('dataQueue', []);
      }
    });

  }

  initValues(){
    console.log("Initializing values");
    return Promise.all([this.loadDeviceID(), this.loadJWT(), this.loadDataQueue(), this.loadDatasets()]);
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
    console.log('getting jwt');
    return this.jwt;
  }

  getDeviceID(){
    return this.deviceID
  }

  storeDatasets(datasets) {
    console.log('Storing datasets', datasets);
    this.datasets = datasets;
    this.storage.set('datasets', datasets).then(() => {
      console.log("Finished storing datasets");
      this.newDatasetsAvailable.next();
    });
  }

  private base64EncodeFiles(data: object){
    let promises = new Array();
    let newdata = {};
    console.log('Base64 encoding data', data);
    for(let key in data){
      if(typeof data[key] === "string" && data[key].indexOf('file://')==0){
        console.log('Convert file to base64 for',key);
        let prom = this.getBase64String(data[key]).then((result) => {
          newdata[key] = result;
          console.log("Finished encoding file to", result);
        });
        promises.push(prom);
      }
      else if(data[key] instanceof Object){
        let prom = this.base64EncodeFiles(data[key]).then((result) => {
          newdata[key] = result;
          console.log("Finished encoding object to", result);
        });
        promises.push(prom);
      }
      else{
        newdata[key] = data[key];
      }
    }
    return Promise.all(promises).then(() => {
      return newdata;
    });
  }

  private getBase64String(fileuri: string){
    let sourcePath = this.getPathForImage(fileuri.replace('file://',''));
    return this.base64.encodeFile(sourcePath).then((base64Str: string) => {
      console.log(base64Str);
      return base64Str;
    });
  }

  public uploadData(){
    console.log("Starting data upload.");
    this.uploading = true;
    this.storage.get('dataQueue').then((dataQueue) => {
      if(dataQueue.length>0){
        let uuid = dataQueue[0];
        this.storage.get(uuid).then((item) => {
          let dsname = item['datasetname'];
          let fname = item['formname'];
          this.base64EncodeFiles(item['data']).then((encodeResult) => {
            console.log('Finished encoding', encodeResult);
            let senditem = {
              report_id: uuid,
              device_id: this.getDeviceID(),
              form: fname,
              dataset: dsname,
              formdata: encodeResult
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
        });
      }
      else{
        this.uploading = false;
        console.log("Nothing to upload.");
      }
    });
  }

  public storeData(datasetname, formname, data) {
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

  public removeQueueItems(uuids: string[]){
    console.log("Removing queue items", uuids);
    return this.storage.get('dataQueue').then((oldQueue) => {
      console.log("Old queue", oldQueue);
      for(let uuid of uuids){
        let i = oldQueue.indexOf(uuid);
        console.log("Removing",uuid,", index",i,"from the old queue",oldQueue);
        oldQueue.splice(i, 1);
      }
      console.log("New queue", oldQueue);
      return this.storage.set('dataQueue', oldQueue).then(() => {
        this.queueChange.next(oldQueue.length);
        let promises = new Array();
        for(let uuid of uuids){
          promises.push(this.storage.remove(uuid));
        }
        return Promise.all(promises);
      });
    });
  }

  public exportQueue(){
    console.log("Exporting queue to a file");
    let data = {};
    let uuids = new Array();
    this.storage.get('dataQueue').then((dataQueue) => {
      let promises = new Array();
      for(let i in dataQueue){
        // loop over the queue
        let uuid = dataQueue[i];
        promises.push(this.storage.get(uuid).then((item) => {
          let dsname = item['datasetname'];
          let fname = item['formname'];
          return this.base64EncodeFiles(item['data']).then((encodeResult) => {
            console.log('Finished encoding', encodeResult);
            let storeitem = {
              form: fname,
              dataset: dsname,
              report_id: uuid,
              device_id: this.getDeviceID(),
              token: this.getJWT(),
              formdata: encodeResult
            }
            console.log("Storing", storeitem);
            data[uuid+'.json'] = JSON.stringify(storeitem);
            uuids.push(uuid);
          });
        }));
      }
      Promise.all(promises).then(() => {
        let sharefunc: any;
        let sharefail = function(err){
          console.error("Failed sharing export file.", err);
        }
        if(this.plt.is('cordova')){
          this.shareCordova(data).then(this.removeQueueItems(uuids)).catch(sharefail);
        }
        else{
          this.shareWeb(data).then(this.removeQueueItems(uuids)).catch(sharefail);
        }
      }).catch((err) => {
        console.error("Failed to create export file.", err);
      });
    }).catch((err) => {
      console.error("Failed getting data queue.", err);
    });
  }

  public getDatasets() {
    return this.datasets;
  }
  
  public shareCordova(data){
    console.log('Sharing file on Cordova');
    console.log('This', this);
    let ts = new Date().getTime().toString();
    console.log('ts',ts);
    let tempdir = this.file.dataDirectory+ts;
    console.log('tempdir', tempdir);
    let zfname = this.file.dataDirectory+'/'+'export-'+ts+'.zip';
    console.log('zfname', zfname);
    return this.file.createDir(this.file.dataDirectory, ts, true).then(() => {
      let promises = new Array();
      for(let filename in data){
        promises.push(this.file.writeFile(tempdir, filename, data[filename]));
      }
      return Promise.all(promises).then(() => {
        let zeep = (<any>window).Zeep;
        console.log('zeep', zeep);
        return new Promise((resolve, reject) => {
          zeep.zip({
            from: tempdir,
            to: zfname
          }, resolve, reject);
        }).then((res) => {
            console.log("Successfully saved zip file.", res);
            this.sharing.share('Please upload this file in the admin interface', 'Data exported', zfname, null).then(() => {
              this.file.removeRecursively(this.file.dataDirectory, ts);
              this.file.removeFile(this.file.dataDirectory, 'export-'+ts+'.zip');
              console.log("Done cleaning up");
            })
        })
      });
    });
  }

  public shareWeb(data){
    console.log('Downloading data as zip file using JSZip.', data);
    let f = new JSZip()
    let ts = new Date().getTime().toString();
    for(let filename in data){
      f.file(filename, data[filename]);
    }
    return f.generateAsync({type: 'blob'}).then((blob) => {
      console.log('Finished creating zip file');
      saveAs(blob, "export-"+ts+".zip");
    });
  }


}
