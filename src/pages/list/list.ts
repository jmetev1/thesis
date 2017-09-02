import { Component } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';
import { RequestService } from '../../app/request.service'

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  platform:Platform
  coord:Array<number> = [0, 0]
  progress:String = '';
  impacts: Array<object>
  holes: Array<object>

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    platform:Platform,
    requestService: RequestService,
  ) {
    requestService.getPotholes()
    .then(values => this.holes = values)

    requestService.getImpacts()
    .then(hits => {
      this.impacts = hits.map(e => {
        e.date = e.date.slice(5, 7) + '-'+ e.date.slice(8, 10) + '-'+
        e.date.slice(0,4)
        e.force = e.force.toFixed(e.force/9.8, 1)
        return e
      })
    })
  }
}

// platform.ready().then(() => {
  // nativeAudio.preloadSimple(
    //   'beep', '../assets/sounds/beep15.mp3')
    //   .then(onSuccess => this.progress = onSuccess,
    //     onError => this.progress = onError)
    // })
    // const makeSound = () => {
      //   nativeAudio.play('beep')
      //     .then(onSuccess => this.progress = onSuccess,
      //     onError => this.progress = onError)
      // }
      // getPotholes(): void {
        //   this.requestService.getPotholes()
        //   .then(values => this.holes = values)
        // }
        
        // import { NativeAudio } from '@ionic-native/native-audio';
        // import { Geolocation } from '@ionic-native/geolocation';
        // import { FormsModule }   from '@angular/forms';