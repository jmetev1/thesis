import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import {ShakeProvider } from '../../app/providers/shakeProvider';

import { FormsModule }   from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html',
  providers: [ShakeProvider]
})
export class Homepage {
  private lastX:number;
  private lastY:number;
  private lastZ:number;
  private moveCounter:number = 0;
  platform: Platform;
  accels: Array<number> = [0, 0, 0];
  limit:number;
  joltSize:number;
  trigger:String = 'none'
  curPlatform:Array<string> = ['a', 'a']
  deviceMotion: DeviceMotion
  constructor(
    private navController:NavController,
    platform:Platform) {
    this.limit = 2;
    this.joltSize = 1;
    platform.ready().then(() => {
      if (platform.is('cordova') === true) {
        this.check()
      } else {
        setInterval(() =>  {
          this.trigger = 'SHOOOK!';
          setTimeout(() => {this.trigger = ''}, 2000)
        }, 3000)
      }
    })
  }
  check = () => {
    this.accels = [1,1,1]
    var subscription = this.deviceMotion.watchAcceleration({frequency:200})
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
        if(deltaX + deltaY + deltaZ > 3) {
          this.moveCounter++;
        } else {
          this.moveCounter = Math.max(0, --this.moveCounter);
        }
        if(this.moveCounter > this.limit) {
          console.log('SHAKE');
          this.saveTrigger();
          this.moveCounter=0;
        }
      });
    }
  saveTrigger() {
    this.trigger = 'SHOOOK!';
    setTimeout(() => {this.trigger = ''}, 2000)
  }
}
