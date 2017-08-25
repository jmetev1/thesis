import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class CatProvider {
  data: any;

  constructor() {
    this.data = [];

    for(var i=0;i<3;i++) {
      this.data.push(this.makeCat());
    }
  }
  makeCat() {
    return {
      "name":"Cat "+(this.data.length+1),
      "id":+(this.data.length+1)
    }
  }
  load() {
      //add a cat
      this.data.push(this.makeCat());
      return Promise.resolve(this.data);
  }

}