import { Component, OnInit } from '@angular/core';
import { LoadingController, Loading, ToastController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators }   from '@angular/forms';
import { PageService } from '../../providers/page-service/page-service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../providers/storage-service/storage-service';
import { HomePage } from '../home/home';
import { environment } from '@environment';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit{

  loginForm: FormGroup;
  loginError: string;
  loading: Loading;
  backend_uri: string = environment.backend_uri;

  constructor(
    private storageService: StorageService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    public pageService: PageService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {
  }
  
  valid(fieldname): boolean{
    return this.loginForm.get(fieldname).valid;
  }
  
  errors(fieldname){
    return this.loginForm.get(fieldname).errors;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  

  login(){
    this.loading = this.loadingCtrl.create({
      content: "Logging in. Please wait...",
    })
    this.loading.present().then(() => {
      this.http.post<object>(this.backend_uri+"/login_app", this.loginForm.value)
        .subscribe((data) => {
          console.log("Login result:", data);
          this.loading.dismiss();
          if(!data['success']){
            this.loginError = data['message'];
          }
          else{
            console.log("Got a valid JWT, setting it in storage.");
            this.storageService.setJWT(data['token']).then(() => {
              this.storageService.loadJWT().then(() => {
                console.log("popping navCtrl");
                this.navCtrl.pop();//push(HomePage,{},{direction: 'back'});
              });
            });
          }
        }, (error) => {
          this.loading.dismiss();
          this.loginError = "Failed reaching server.";
          this.toastCtrl.create({
            message: "Failed to connect to the login page. Do you have an internet connection? This is required for the first time login only.",
            position: 'top',
            duration: 3000
          }).present();
        });
    });
  }

  ngOnInit(){
    this.loginForm = this.fb.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });
  }

}
