import { GoogleMap, GoogleMapsEvent } from '@ionic-native/google-maps';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {
  map: GoogleMap;

     constructor(public navCtrl: NavController, public platform: Platform) {
         platform.ready().then(() => {
             this.loadMap();
         });
     }

     loadMap(){


         this.map = new GoogleMap('map', {
           'controls': {
             'compass': true,
             'myLocationButton': true,
             'indoorPicker': true,
           },
           'gestures': {
             'scroll': true,
             'tilt': true,
             'rotate': true,
             'zoom': true
           },
           'camera': {
             'target': {
               'lat': 43.0741904,
               'lng': -89.3809802
             },
             'tilt': 30,
             'zoom': 15,
             'bearing': 50
           }
         });

         this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
             console.log('Map is ready!');
         });

     }
}


