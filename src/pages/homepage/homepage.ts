import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DeviceMotion } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { RequestService } from '../../app/request.service'

@IonicPage()
@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class Homepage {
  deviceMotion: DeviceMotion
  private lastX:number;
  private lastY:number;
  private lastZ:number;
  private moveCounter:number = 0;
  accels: Array<number> = [0, 0, 0];
  limit:number;
  joltSize:number;
  trigger:String = 'none'
  coord: Array<number> = [0, 0, 0]
  total: Number = 0
  holes: any = [1,1,1]

  constructor(
  private navController:NavController,
  platform:Platform,
  deviceMotion:DeviceMotion,
  private requestService: RequestService,
  private geolocation: Geolocation) {

    this.getPotholes()
    this.limit = 2;
    this.joltSize = 1;
    platform.ready().then(() => {
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        this.coord[0] = data.coords.latitude
        this.coord[1] = data.coords.longitude
        this.coord[2] = data.coords.speed
      })
      if (platform.is('cordova') === true) {
        const check = () => {
          this.accels = [1,1,1]
          deviceMotion.watchAcceleration({frequency:200})
            .subscribe(acc => {
              this.accels = [2,2,2]
              if(!this.lastX) {
                this.lastX = acc.x;
                this.lastY = acc.y;
                this.lastZ = acc.z;
                return;
              }
              this.accels = [acc.x, acc.y, acc.z];
              let deltaX:number, deltaY:number, deltaZ:number;
              deltaX = Math.abs(acc.x-this.lastX);
              deltaY = Math.abs(acc.y-this.lastY);
              deltaZ = Math.abs(acc.z-this.lastZ);
              let total = deltaX + deltaY + deltaZ
              if(deltaX + deltaY + deltaZ > 3) {
                this.moveCounter++;
              } else {
                this.moveCounter = Math.max(0, --this.moveCounter);
              }
              if(this.moveCounter > this.limit) {
                console.log('SHAKE');
                this.saveTrigger(total);
                this.moveCounter=0;
              }
            });
          }
        check()
      } else {
        // setInterval(() =>  this.saveTrigger(0), 3000)
      }
    })
  }
  saveTrigger(shake: Number) {
    let lat = 29.927594 + Math.random() * .08865
    let long = -90.132690 + Math.random() * .196903
    this.requestService.createPothole({
      name: 'Other Truck Sinker',
      lat: lat,
      lng: long}).then(
      reply => this.trigger += reply
    )
    // this.trigger = 'SHOOOK!';
    // setTimeout(() => {this.trigger = ''}, 2000)
  }
  getPotholes(): void {
    this.requestService
      .getPotholes()
      .then(values => this.holes = values)
  }
  fakeLoc() {
    // this.coord[0] = lat
    // this.coord[1] = long
    // this.coord[2] = Math.random() * 70
    // return this.coord
  }

}
