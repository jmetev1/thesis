import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder'
import { NativeStorage } from '@ionic-native/native-storage';
import { RequestService } from '../../app/request.service'


@IonicPage()
@Component({
  selector: 'page-manual-entry',
  templateUrl: 'manual-entry.html',
})
export class ManualEntryPage {
  name: string;
  lat: number;
  lng: number;
  location: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private requestService: RequestService,
    private nativeStorage: NativeStorage,
    public navParams: NavParams) {
      this.geolocation.getCurrentPosition().then((resp) => {
        const round = (t, d) => Number(Math.round(Number(t+'e'+d))+'e-'+d)
        this.lat = round(resp.coords.latitude, 4)
        this.lng = round(resp.coords.longitude, 4)
        this.nativeGeocoder.reverseGeocode(this.lat, this.lng)
          .then(res => this.location = `${res.subThoroughfare} ${res.thoroughfare}`)
      }).catch((error) => console.log('Error getting location', error));
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Heads up!',
      subTitle: 'This pothole has already been registered. Thank you for letting us know its still a problem!',
      buttons: ['OK']
    });
    alert.present();
  }

  addPothole() {
      this.requestService.getPotholeByLocation(this.lat, this.lng)
      .then(data => {
        if (data.length === 0) {
          this.requestService.createPothole({
            name: this.name,
            lat: this.lat,
            lng: this.lng
          })
          .then(hole => {
            this.nativeStorage.getItem('user')
              .then(user => {
                this.requestService.createImpact({
                  force: [1],
                  users_id: user.id,
                  pothole_id: hole.id
                }).then(impact => console.log('impact created', impact))
              })
          })
        } else {
          this.showAlert()
          this.nativeStorage.getItem('user')
            .then(user => {
              this.requestService.createImpact({
                force: [1],
                users_id: user.id,
                pothole_id: data[0].id
              }).then(impact => console.log(impact, 'impact saved'))
            })
        }
      })
  }

}
