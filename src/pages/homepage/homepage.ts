import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DeviceMotion } from '@ionic-native/device-motion';
import { Geolocation } from '@ionic-native/geolocation';
import { RequestService } from '../../app/request.service';

@IonicPage()
@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class Homepage {
  private moveCounter:number = 0;
  accels: Array<number>
  limit:number;
  joltSize:number = 3;
  trigger:String = 'none'
  coord: Array<number> = [0, 0, 0]
  total: Number = 0
  holes: any = [1,1,1]

  constructor(
  private navController:NavController,
  platform:Platform,
  private deviceMotion:DeviceMotion,
  private requestService: RequestService,
  private geolocation: Geolocation) {
    this.getPotholes()
    this.limit = 2;
    platform.ready().then(() => {
      this.outside()
      if (platform.is('cordova') === true) {
        this.check()
      }
    })
  }
  outside() {
    let watch = this.geolocation.watchPosition()
    watch.subscribe((data) => {
      this.coord[0] = data.coords.latitude
      this.coord[1] = data.coords.longitude
      this.coord[2] = data.coords.speed || -10
    })
  }
  count = 0
  saveImpact(force:Number) {
    let lat = 29.927594 + Math.random() * .08865
    let long = -90.132690 + Math.random() * .196903
    this.requestService.getPothole(lat, long)
      .then(data => {
        if (data.length === 0) {
          this.requestService.createPothole({
            name: this.name(),
            lat: lat,
            lng: long})
            .then(hole => {
              this.requestService.createImpact({
                force: force,
                users_id: 1,
                pothole_id: hole.id
              }).then(impact => console.log(impact))
          })
        } else {
          this.requestService.createImpact({
            force: force,
            users_id: 1,
            pothole_id: data[0].id
          }).then(impact => console.log(impact));
        }
      })
  }
  saveTrigger() {
    this.count++
    this.trigger = this.count.toString();
    let lat = 29.927594 + Math.random() * .08865
    let long = -90.132690 + Math.random() * .196903
    this.requestService.createPothole({
      name: this.name(),
      lat: lat,
      lng: long})
      .then(hole => console.log(hole))
    }
    getPotholes(): void {
      this.requestService.getPotholes()
      .then(values => this.holes = values)
    }
    name() {
      let first = ['cavern', 'pit', 'hole', 'jaws', 'crater', 'pit',
      'rut', 'bump', 'dent']
      let second = ['despair', 'lost cars', 'infinite depth',
      'Moria', 'tremendous damage', 'get your checkbook out',
      'desperation', 'disheartenment', 'dashed hopes']
      const random = () => Math.floor(Math.random() * first.length)
      return first[random()] + ' of ' + second[random()]
    }
    check = () => {
      let lastX, lastY, lastZ
      this.deviceMotion.watchAcceleration({frequency:200})
        .subscribe(acc => {
          if(!lastX) {
            lastX = acc.x;
            lastY = acc.y;
            lastZ = acc.z;
            return;
          }
          let deltaX, deltaY, deltaZ
          deltaX = Math.abs(acc.x-lastX);
          deltaY = Math.abs(acc.y-lastY);
          deltaZ = Math.abs(acc.z-lastZ);
          this.accels = [deltaX, deltaY, deltaZ];
          if(deltaX + deltaY + deltaZ > this.joltSize) {
            this.total = deltaX + deltaY + deltaZ
            this.moveCounter++;
          } else {
            this.moveCounter = Math.max(0, --this.moveCounter);
          }
          if(this.moveCounter > this.limit) {
            this.saveImpact(this.total)
            // this.saveTrigger();
            this.moveCounter=0;
          }
          lastX = acc.x;
          lastY = acc.y;
          lastZ = acc.z;
      });
    }
  }