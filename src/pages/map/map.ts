import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions,
  CameraPosition, MarkerOptions,  Marker
 } from '@ionic-native/google-maps';
import { Component } from "@angular/core/";
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { RequestService } from '../../app/request.service'

@Component({
  selector: 'Map-page',
  templateUrl: 'map.html'
})
export class MapPage {
  map: GoogleMap;
  holes: any = [1,1,1]
  mapElement: HTMLElement;
  constructor(private googleMaps: GoogleMaps, public platform: Platform,
  private requestService:RequestService, private geolocation: Geolocation,
) {
    platform.ready().then(() => {
      this.outside();
    });
  }
  outside() {
    let watch = this.geolocation.watchPosition()
    watch.subscribe((data) => this.loadMap(data))
  }
  loadMap(data) {
      this.mapElement = document.getElementById('map');
      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: data.coords.latitude,
            lng: data.coords.longitude
          },
          //was 18 before, too close
          zoom: 12,
          tilt: 30
        }
      };
    this.map = this.googleMaps.create(this.mapElement, mapOptions);
    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
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
              // .then(marker => {
              //   marker.on(GoogleMapsEvent.MARKER_CLICK)
              //     .subscribe(() => {
              //       // alert('clicked');
              //     });
              // });
            })
        })
      });
  }
}



