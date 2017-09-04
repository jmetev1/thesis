import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions,
  // CameraPosition, MarkerOptions,   Marker
 } from '@ionic-native/google-maps';
import { Component } from "@angular/core/";
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { RequestService } from '../../app/request.service'
import { Events } from 'ionic-angular';

@Component({
  selector: 'Map-page',
  templateUrl: 'map.html'
})
export class MapPage {
  map: GoogleMap;
  holes: any = [1,1,1]
  mapElement: HTMLElement;
  mapLoaded:Boolean = false

  constructor(private googleMaps: GoogleMaps, public platform: Platform,
  private requestService:RequestService, private geolocation: Geolocation,
  public events:Events
) {
  events.subscribe('menu:opened', () => {
    console.log('opened')
    this.map.setClickable(false)
  });
  events.subscribe('menu:closed', () => {
    console.log('closed')
    this.map.setClickable(true)
  });
  platform.ready().then(() => {
      this.outside();
    });
  }
  outside() {
    // let watch = this.geolocation.watchPosition()
    // watch.subscribe((data) =>
     this.loadMap()
  }
  loadMap() {
    this.mapLoaded = true;
      this.mapElement = document.getElementById('map');
      let mapOptions: GoogleMapOptions = {
        controls: {myLocationButton: true},
        camera: {
          target: {
            lat: 29.988700,
            lng: -90.046367
          },
          zoom: 11,
          tilt: 30
        }
      };
    this.map = this.googleMaps.create(this.mapElement, mapOptions);
    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.requestService.getPotholes().then(values => {
        values.forEach(ph => {
          this.map.addMarker({
            title: ph.name,
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: ph.lat,
              lng: ph.lng
            }
          })
        });
        let watch = this.geolocation.watchPosition({
          enableHighAccuracy: true
        })
        watch.subscribe((data) => {
          // this.map.addMarker({
          //   title: "Your Location",
          //   // icon: 'red',
          //   // {
          //   //   path: google.maps.SymbolPath.CIRCLE,
          //   //   scale: 10
          //   // },
          //   animation: 'DROP',
          //   position: {
          //     lat: data.coords.latitude,
          //     lng: data.coords.longitude
          //   }
          // })
        })
      })
    })
  };
}



