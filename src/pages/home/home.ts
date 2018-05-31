import { Component, OnInit } from '@angular/core';
import { PageService } from '../../providers/page-service/page-service';
import { LoadingController, Loading } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  datasets: object;
  formSchema: object;
  loading: Loading;

  constructor(
    public pageService: PageService,
    public loadingCtrl: LoadingController,
  ) {
  }

  startLoadingFirstDatasets() {
    this.loading = this.loadingCtrl.create({
      content: "Loading first datasets when a connection with the server is available. Please wait..."
    });
    this.loading.present();
    this.pageService.newDatasetsAvailable.subscribe(() => {
      console.log("newDatasetsAvailable");
      this.datasets = this.pageService.getDatasets();
      console.log("loaded datasets", this.datasets);
      this.formSchema = this.datasets['Pawikan'];
      this.loading.dismiss();
    });
  }

  startLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Loading app, please wait..."
    });
    this.loading.present();
    this.pageService.ready.subscribe(() => {
      let datasets = this.pageService.getDatasets();
      this.loading.dismiss();
      if(datasets !== null){
        console.log("loaded datasets", this.datasets);
        this.datasets = datasets;
        this.formSchema = this.datasets['Pawikan'];
      }
      else{
        this.startLoadingFirstDatasets();
      }
    });
  }

  stopLoading() {
    this.loading.dismiss();
  }

  ngOnInit(){
    this.pageService.pagetitle = 'Home';
    this.startLoading();
  }
  
}
