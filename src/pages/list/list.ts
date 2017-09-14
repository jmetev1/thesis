import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { RequestService } from '../../app/request.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeGeocoder } from '@ionic-native/native-geocoder';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  impacts: Array<any>
  holes: Array<object>
  potholes: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public requestService: RequestService,
    private socialSharing: SocialSharing,
    private nativeGeocoder: NativeGeocoder
  ) {
    requestService.getImpacts()
      .then(hits => {
        this.impacts = hits.slice(0, 25).map(e => {
          e.date = e.date.slice(5, 7) + '-'+ e.date.slice(8, 10) + '-'+
          e.date.slice(0,4)
          e.force = e.force.reduce((a, c) => a + (c/9.8).toString().slice(0,3)+',', '')
          return e
        })
        this.impacts.forEach(impact => {
          this.requestService.getPotholeById(impact.pothole_id)
            .then(hole => {
              this.nativeGeocoder.reverseGeocode(hole.lat, hole.lng)
              .then(add => {
                this.potholes.push({
                  date: impact.date,
                  force: impact.force,
                  name: hole.name,
                  num: add.subThoroughfare,
                  street: add.thoroughfare
                })
              })
            })
        })
      })
  }

  postToFb(p: any): any {
    let message = `I hit the ${p.name} on ${p.date} at ${p.num} ${p.street}. It had a force of ${p.force} g's! @MayorLandrieu`
    this.socialSharing.share(message, null, null)
  }

}