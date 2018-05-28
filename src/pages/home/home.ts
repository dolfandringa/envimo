import { Socket } from 'ng-socket-io';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PageService } from '../../providers/page-service/page-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  datasets: object;
  formSchema: object;

  constructor(
    public pageService: PageService,
    private socket: Socket,
  ) {
    this.pageService.pagetitle = 'Home';
    this.onConnect().subscribe(data => {
      console.log('Connected');
      this.socket.emit("message", "Hello World!");
    });
    console.log('Connecting to websocket');
    this.socket.connect();
  }

  ngOnInit(){
    this.socket.fromEvent("newDatasets").subscribe((datasets) => {
      console.log('newDatasets triggered with datasets', datasets);
      this.datasets = datasets;
      this.formSchema = datasets['Pawikan'];
      console.log('Loading form', this.formSchema);
    });
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
