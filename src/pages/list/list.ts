import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage implements OnInit{

  constructor( 
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
  }

  locationChanged(location){
    console.log("Test Page Location changed to", location);
  }


  ngOnInit(){
  }

}

