import { Component, OnInit } from '@angular/core';
import { PageService } from '../../providers/page-service/page-service';
import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  datasets: object;
  formSchema: object;
  datasetName: string = 'Pawikan';
  loading: Loading;
  private active: boolean = true;
  private actOnNewDatasets: boolean = true;
  private loadingActive: boolean = false;

  constructor(
    public pageService: PageService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
  ) {
  }


  ionViewDidLeave(){
    console.debug("Deactivating subscriptions.");
    this.pageService.deactivate();
    this.active = false;
  }


  saveForm(form: DynamicFormComponent) {
    console.log("Saving form", form);
    this.loading = this.loadingCtrl.create({
      content: "Saving data."
    });
    this.loading.onDidDismiss(() => {
      this.loadingActive = false;
    });
    this.loading.present().then(() => {
      this.loadingActive = true;
      let formname = form.formName;
      this.pageService.saveData(this.datasetName, formname, form.value)
        .then(
          () => {
            if(this.loadingActive){
              this.loading.dismiss();
            }
            this.toastCtrl.create({
              message: "Data was saved successfully. It will be uploaded when internet is available.",
              duration: 3000,
              position: 'top'
            }).present();
          },
          (err) => {
            console.error(err);
            if(this.loadingActive){
              this.loading.dismiss();
            }
            this.toastCtrl.create({
              message: "Error saving the data. Please report his to the developers.",
              duration: 3000,
              position: 'top'
            }).present();
          });
    });
  }

  startLoading() {
    this.pageService.newDatasetsAvailable
      .takeWhile(() => this.actOnNewDatasets && this.active)
      .subscribe(() => {
        console.log("newDatasetsAvailable");
        this.datasets = this.pageService.getDatasets();
        console.log("loaded datasets", this.datasets);
        this.formSchema = this.datasets[this.datasetName];
        if(this.loadingActive){
          this.loading.dismiss();
        }
        this.actOnNewDatasets = false;
      });
    this.pageService.ready
      .takeWhile(() => this.active)
      .subscribe(() => {
        console.log("Pageservice ready.")
        let datasets = this.pageService.getDatasets();
        if(datasets !== null){
          if(this.loadingActive){
            this.loading.dismiss();
          }
          console.log("loaded datasets", this.datasets);
          this.datasets = datasets;
          this.actOnNewDatasets = false;
          this.formSchema = this.datasets[this.datasetName];
        }
        else{
          console.log("No datasets yet");
          this.loading.setContent("Loading first datasets when a connection with the server is available. Please wait...");
        }
      });
    this.loading = this.loadingCtrl.create({
      content: "Loading app, please wait...",
    });
    this.loading.onDidDismiss(() => {
      this.loadingActive = false;
    });
    this.loading.present().then(() => {
      this.loadingActive = true;
      console.log("Initializing pageservice");
      this.pageService.initialize();
    });
  }

  ngOnInit(){
    console.log("Homepage OnInit");
  }

  ionViewDidEnter(){
    this.init();
  }

  init(){
    console.log("Homepage init");
    this.active = true;
    this.pageService.loginError
      .takeWhile(() => this.active)
      .subscribe(() => {
        console.log('Redirecting to login page');
        this.navCtrl.push(LoginPage);
        this.loading.dismissAll();
      });
    this.startLoading();
  }
  
}
