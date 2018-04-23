import { Socket } from 'ng-socket-io';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DynamicFormService {
  public forms = {};
  constructor(private socket: Socket) {
    console.log("Started dynamic form service");
    this.onConnect().subscribe(data => {
      console.log('Connected');
      this.socket.emit("message", "Hello World!");
    });
    this.onForms().subscribe(data => {
      console.log('Got new forms', data);
      this.forms = data;
    });
    console.log('Connecting to websocket');
    this.socket.connect();
  }

  onForms(){
    return this.socket.fromEvent("newForms").map( data => data.msg);
  }

  onConnect(){
    let obs = new Observable(observer => {
      this.socket.on('connect', (data) => {
        observer.next(data);
      });
    });
    return obs;
  }

}
