import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { FormsModule }   from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html',
})
export class Homepage {
  private lastX:number;
  private lastY:number;
  private lastZ:number;
  private moveCounter:number = 0;
  platform: Platform;
  accels: Array<number>;
  limit:number;
  show:Boolean;
  joltSize:number;
  deviceMotion: DeviceMotion;

  constructor(
    private navController:NavController,
    platform:Platform) {
    this.loadAcc();
    this.limit = 2;
    this.show = false;
    this.joltSize = 1;
  }
  loadMore() {
    console.log('load more cats');
    this.loadAcc();
  }
  accOn() {
    this.platform.ready().then(() => {
      var subscription = this.deviceMotion.watchAcceleration({frequency:200}).subscribe(acc => {
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
          this.moveCounter=0;
        }
      });
    });
  }

  loadAcc() {
    this.accels = [Math.random(), this.limit, this.lastZ];
  }
}
