import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { CatProvider } from '../../app/providers/cat-provider/cat-provider';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';

@IonicPage()
@Component({
  providers: [CatProvider],
  selector: 'page-homepage',
  templateUrl: 'homepage.html',
})
export class Homepage {
  public cats:Array<Object>;
  private lastX:number;
  private lastY:number;
  private lastZ:number;
  private moveCounter:number = 0;
  platform: Platform;
  accels: Array<number>;

  constructor(
    public catProvider:CatProvider,
    private navController:NavController,
    platform:Platform,
    deviceMotion: DeviceMotion) {
    this.loadCats();

    platform.ready().then(() => {
      var subscription = deviceMotion.watchAcceleration({frequency:200}).subscribe(acc => {
        if(!this.lastX) {
          this.lastX = acc.x;
          this.lastY = acc.y;
          this.lastZ = acc.z;
          return;
        }
        const accels: Array<number> = [this.lastX, this.lastY, this.lastZ];

        let deltaX:number, deltaY:number, deltaZ:number;
        deltaX = Math.abs(acc.x-this.lastX);
        deltaY = Math.abs(acc.y-this.lastY);
        deltaZ = Math.abs(acc.z-this.lastZ);

        if(deltaX + deltaY + deltaZ > 3) {
          this.moveCounter++;
        } else {
          this.moveCounter = Math.max(0, --this.moveCounter);
        }

        if(this.moveCounter > 2) { 
          console.log('SHAKE');
          this.loadCats(); 
          this.moveCounter=0; 
        }

        this.lastX = acc.x;
        this.lastY = acc.y;
        this.lastZ = acc.z;

      });
    });
  }
  loadMore() {
    console.log('load more cats');
    this.loadCats();
  }

  loadCats() {
    this.catProvider.load().then(result => {
      this.cats = result;
    });
  }

}

            //   constructor(
            //     public catProvider:CatProvider,
            //     private navController: NavController,
            //     platform:Platform,
            //     // private deviceMotion: DeviceMotion,
            //   ) {
            //     // this.loadCats();
            //     platform.ready().then(() => {
            //       // ready = 'true';
            //     })
            //   }
            // }
            