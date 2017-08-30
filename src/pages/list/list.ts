import { Component } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
import { NativeAudio } from '@ionic-native/native-audio';
import { Geolocation } from '@ionic-native/geolocation';
import { FormsModule }   from '@angular/forms';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  platform:Platform
  coord:Array<number> = [0, 0]
  progress:String = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    platform:Platform,
    private nativeAudio: NativeAudio
    ) {
    platform.ready().then(() => {
      nativeAudio.preloadSimple(
        'beep', '../assets/sounds/beep15.mp3')
        .then(onSuccess => this.progress = onSuccess,
          onError => this.progress = onError)
    })
    const makeSound = () => {
      nativeAudio.play('beep')
        .then(onSuccess => this.progress = onSuccess,
        onError => this.progress = onError)
    }
  }
}
