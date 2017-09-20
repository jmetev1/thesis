import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation';


import 'rxjs/add/operator/toPromise';

export class Pothole {
  name: string;
  lat: number;
  lng: number;
}
export class Impact {
  date: Date;
  force: number[];
  pothole_id: Number;
  user_id: Number;
}
@Injectable()
export class RequestService {
  subscribe: any;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  // private url = 'http://54.227.175.5/'
  private url = 'https://cratergator.club/';
  constructor(
    private http: Http, private nativeStorage: NativeStorage, private geolocation: Geolocation,
  ) { }

  location() {
    console.log('location')
    if (this.subscribe) {
      if (this.subscribe.unsubscribe) {
        this.subscribe.unsubscribe();
      }
    }
    return this.geolocation.getCurrentPosition().then(resp => resp);
  }

  watch() {
    console.log('watch')
    this.subscribe = this.geolocation;
    return this.subscribe;
    // watchPosition(      { enableHighAccuracy: true }).subscribe(loc => loc);
  }

  snapToRoad(lat, lng) {
    console.log('snapto')
    const key = 'AIzaSyCDkBmhOoNsGrpIXsS4R-CT4IoVLrYuATU';
    const roadUrl = `https://roads.googleapis.com/v1/snapToRoads?path=${lat},${lng}&key=${key}`;
    return this.http.get(roadUrl).toPromise().then(res => res.json())
    .catch(this.handleError);
  }
  // post requests
  createImpact(info: any): any {
    console.log('create', 'rq serv 56', info)
    return this.http.post(`${this.url}impact`,
                          JSON.stringify(info),
                          { headers: this.headers }).toPromise()
    .then(res => res.json()).catch(this.handleError);
  }
  // createImpact(info: any): any {
  //   console.log('create', 'rq serv 56', info)
  //   return this.http.post(`${this.url}impact`,
  //                         JSON.stringify({
  //                           users_id: 45,
  //                           force: [1,1,1],
  //                           pohothole_id: 1,
  //                         }),
  //                         { headers: this.headers }).toPromise()
  //   .then(res => res.json()).catch(this.handleError);
  // }
  createPothole(info: any): any {
    console.log('create pothole')
    return this.http.post(`${this.url}pothole`,
                          JSON.stringify(info),
                          { headers: this.headers }).toPromise()
    .then(res => res.json()).catch(this.handleError);
  }

  createUser(info: any): any {
    return this.http.post(`${this.url}users`,
                          JSON.stringify(info),
                          { headers: this.headers }).toPromise()
    .then(res => res.json())
    .catch(this.handleError);
  }

  getImpacts() {
    console.log('getimpacts')
    // return this.nativeStorage.getItem('user')
      // .then((user) => {
        // return this.http.get(`${this.url}impact?users_id=${user.id}`)
        return this.http.get(`${this.url}impact`)
          .toPromise()
          .then(response => response.json() as Impact[])
          .catch(this.handleError);
      // });
  }
  getPotholes() {
    console.log('getphs')
    return this.http.get(`${this.url}pothole`)
      .toPromise()
      .then(response => response.json() as Pothole[])
      .catch(this.handleError);
  }

  getUser(userToken: string): any {
    console.log('getuser')
    return this.http.get(`${this.url}users?token=${userToken}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getPotholeByLocation(lat, lng) {
    console.log('getph by id')
    return this.http.get(`${this.url}pothole?lat=${lat}&&lng=${lng}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getPotholeById(id: string) {
    console.log('getph by id')
    return this.http.get(`${this.url}pothole?id=${id}`)
      .toPromise()
      .then(res => res.json()[0] as Pothole)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log('handle error in rq serv');
    return Promise.reject(error.message || error);
  }
}
