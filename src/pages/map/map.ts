import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {
  @ViewChild('map') element;
  error: any = 'ERROR';
  constructor( public navCtrl: NavController, public platform: Platform, public googleMaps: GoogleMaps,) {
    const initMap = () => {
      this.error = 'in initmap';
      let map: GoogleMap = this.googleMaps.create(this.element.nativeElement);
      map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
        this.error = `line 24`;
        let coordinates: LatLng = new LatLng(33.6396965, -84.4304574);
        let position = {
          target: coordinates,
          zoom: 17
        }
        map.animateCamera(position);
      }).catch(err => {
        this.error = `line 42`;
      })
    }
      this.platform.ready().then(() => {
        this.error = 'in platform ready';
        initMap();
      })
    }
}
