import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
 } from '@ionic-native/google-maps';
 import { Component } from "@angular/core/";

 @Component({
   selector: 'page-map',
   templateUrl: 'map.html'
 })
 export class MapPage {
   map: GoogleMap;
   mapElement: HTMLElement;
   error: any = 'made it nowhere';
   constructor(private googleMaps: GoogleMaps) { }

   ionViewDidLoad() {
    this.error = 'in ionviewdidload';
    this.loadMap();
   }

  loadMap() {
    this.error = 'in loadmap';
     this.mapElement = document.getElementById('gmap');
      let mapOptions: GoogleMapOptions = {
       camera: {
         target: {
           lat: 43.0741904,
           lng: -89.3809802
         },
         zoom: 15,
         tilt: 30
       }
     };

     this.map = this.googleMaps.create(this.mapElement, mapOptions);
     // Wait the MAP_READY before using any methods.
     this.map.one(GoogleMapsEvent.MAP_READY)
       .then(() => {
         console.log('in then');
         this.error = 'Map is ready!';

         // Now you can use all methods safely.
         this.map.addMarker({
             title: 'Ionic',
             icon: 'blue',
             animation: 'DROP',
             position: {
               lat: 43.0741904,
               lng: -89.3809802
             }
           })
           .then(marker => {
             marker.on(GoogleMapsEvent.MARKER_CLICK)
               .subscribe(() => {
                 alert('clicked');
               });
           });

       }).catch(err => {
         console.log('in catch');
        this.error = 'ERRROROROROROROOROR';
       });
   }
 }

// import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, MarkerOptions, Marker } from '@ionic-native/google-maps';
// import { AfterViewInit, Component, ViewChild } from '@angular/core';
// import { IonicPage, NavController, Platform } from 'ionic-angular';

// @IonicPage()
// @Component({
//   selector: 'page-map',
//   templateUrl: 'map.html',
// })

// export class MapPage {
//   @ViewChild('map') element;
//   error: any = 'ERROR';
//   constructor( public navCtrl: NavController, public platform: Platform, public googleMaps: GoogleMaps,) {
//     const initMap = () => {
//       this.error = 'in initmap';
//       let map: GoogleMap = googleMaps.create(this.element.nativeElement);
//       map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
//         this.error = `line 24`;
//         let coordinates: LatLng = new LatLng(33.6396965, -84.4304574);
//         let position = {
//           target: coordinates,
//           zoom: 17
//         }
//         map.animateCamera(position);
//       }).catch(err => {
//         this.error = `line 42`;
//       })
//     }
//       this.platform.ready().then(() => {
//         this.error = 'in platform ready';
//         initMap();
//       })
//     }
// }
