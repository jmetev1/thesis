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
  coord: Array<number> = [0, 0]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    platform:Platform,
    ) {
      this.plat = ''
      if (this.plat === 'phone') {
        platform.ready().then(() => {
          this.coord[0] = 1
          this.coord[1] = 1
          let watch = this.geolocation.watchPosition();
          watch.subscribe((data) => {
            this.coord[0] = data.coords.latitude;
            this.coord[1] = data.coords.longitude;
          })
        })
      }
    }
  // playSound() {
  //   this.nativeAudio.play('uniqueId1').then(onSuccess => {
  //     console.log('suc', onSuccess);
  //   }, onError => console.log('error', onError));
  // }
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
