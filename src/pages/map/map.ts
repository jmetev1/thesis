import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage implements AfterViewInit {
  @ViewChild('map') element;

  constructor(public navCtrl: NavController, public platform: Platform, public googleMaps: GoogleMaps) {}
  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.initMap();
    })
  }
  initMap() {

        let map: GoogleMap = this.googleMaps.create(this.element.nativeElement);
        map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
          let coordinates: LatLng = new LatLng(33.6396965, -84.4304574);
          let position = {
            target: coordinates,
            zoom: 17
          };
          map.animateCamera(position);

          let markerOptions: MarkerOptions = {
            position: coordinates,
            icon: "assets/images/icons8-Marker-64.png",
            title: 'Our first POI'
          };

          const marker = map.addMarker(markerOptions)
            .then((marker: Marker) => {
              marker.showInfoWindow();
          });
        })
      }
}


// platform.ready().then(() => {
//   this.map = new GoogleMap('map', {
//     'controls': {
//       'compass': true,
//       'myLocationButton': true,
//       'indoorPicker': true,
//     },
//     'gestures': {
//       'scroll': true,
//       'tilt': true,
//       'rotate': true,
//       'zoom': true
//     },
//     'camera': {
//       'target': {
//         'lat': 43.0741904,
//         'lng': -89.3809802
//       },
//       'tilt': 30,
//       'zoom': 15,
//       'bearing': 50
//     }
//   });

//   this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
//       console.log('Map is ready!');
//   });

// });
// }

