import { Component } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
import { NativeAudio } from '@ionic-native/native-audio';
import {Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  platform: Platform
  plat: String = ''
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeAudio: NativeAudio,
    private geolocation: Geolocation,
    platform:Platform) {
      this.plat = 'phone'
      if (this.plat === 'phone') {
        platform.ready().then(() => {
          this.nativeAudio.preloadSimple('uniqueId1', 'path/to/file.mp3')
            .then(onSuccess => console.log('loaded'));
          let watch = this.geolocation.watchPosition();
          watch.subscribe((data) => {
            let lat = data.coords.latitude;
            let long = data.coords.longitude;
          })
        })
      }
    }
  playSound() {
    this.nativeAudio.play('uniqueId1').then(onSuccess => {
      console.log('suc', onSuccess);
    }, onError => console.log('error', onError));
  }
}

// export class ListPage {
//   icons: string[];
//   items: Array<{title: string, note: string, icon: string}>;

//   constructor(public navCtrl: NavController, public navParams: NavParams) {
//     this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
//     'american-football', 'boat', 'bluetooth', 'build'];

//     this.items = [];
//     for(let i = 1; i < 11; i++) {
//       this.items.push({
//         title: 'Item ' + i,
//         note: 'This is item #' + i,
//         icon: this.icons[Math.floor(Math.random() * this.icons.length)]
//       });
//     }
//   }

//   itemTapped(event, item) {
//     this.navCtrl.push(ItemDetailsPage, {
//       item: item
//     });
//   }
// }
