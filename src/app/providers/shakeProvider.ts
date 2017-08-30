import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class ShakeProvider {
  data: any;

  constructor() {
    // hard coded initial data
    this.data = [];
    
    for(var i=0;i<3;i++) {
      this.data.push(this.makeShake());
    }
  }

  makeShake() {
    return {
      "name":"Shake "+(this.data.length+1),
      "id":+(this.data.length+1)
    }
  }

  load() {
      //add a Shake
      this.data.push(this.makeShake());
      return Promise.resolve(this.data);
  }

}
