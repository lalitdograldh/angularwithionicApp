import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {LoadingController,NavController } from 'ionic-angular';
import 'rxjs/add/operator/map';
@Injectable()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

export class HomePage {
	private myData: any;
	public  response:any;
	public loadingPopup:any;
	public showstartCard:boolean=false;
	public showsecondCard:boolean=false;
	
	constructor(private http: Http,private loadingCtrl: LoadingController,private navCtrl:NavController) {
		this.loadingPopup = this.loadingCtrl.create({
			content: 'Loading data...'

		});
	}
	onSubmit(formData) {

		
		this.loadingPopup.present();
		console.log('form on');
		
		//console.log(formData.value);
		this.myData = formData.value;
		//console.log(formData,formData.value);
		
		var link = 'http://localhost:3000/app';
		
		//console.log(this.myData);
		return this.http.post(link, formData.value)
		.map(res => res.json())
		.subscribe(myData => {

			setTimeout(() => {

			this.response= myData.statuses;
			
            
            this.loadingPopup.dismiss();
          }, 1000);
			
			// console.log(this.statuses,"dsfdsfs");
			//this.navCtrl.push(ResultPage);
		}, error => {
			console.log("Oooops!");
			
		})
	}


	hideCard = function(){
		this.showstartCard = true;
		//this.showsecondCard = true;
		
		
	}
	arrowBack = function()
	{
		this.navCtrl.push(HomePage);
		//this.showsecondCard = false;
	}

}
