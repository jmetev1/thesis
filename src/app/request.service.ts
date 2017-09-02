import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

export class Pothole {
  name: string
  lat: number
  lng: number
}
export class Impact {
  date: Date
  force: Number
  pothole_id: Number
}
@Injectable()
export class RequestService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private url = 'http://54.163.239.254:3000/'
  constructor(private http: Http) { }

  createImpact(info: any): any {
    return this.http.post(`${this.url}impact`,
      JSON.stringify(info),
    {headers: this.headers}).toPromise()
    .then(res => res.json()).catch(this.handleError);
  }
  createPothole(info: any): any {
    return this.http.post(`${this.url}pothole`,
      JSON.stringify(info),
    {headers: this.headers}).toPromise()
    .then(res => res.json()).catch(this.handleError);
  }
  getImpacts() {
    return this.http.get('http://54.163.239.254:3000/impact')
      .toPromise()
      .then(response => response.json().data as Impact[])
      .catch(this.handleError)
  }
  getPotholes() {
    return this.http.get('http://54.163.239.254:3000/pothole')
      .toPromise()
      .then(response => response.json().data as Pothole[])
      .catch(this.handleError)
  }

  // getHeroes(): Promise<Hero[]> {
  //   return this.http.get(this.heroesUrl)
  //              .toPromise()
  //              .then(response => response.json().data as Hero[])
  //              .catch(this.handleError);
  // }
    // return this.http.post('http://54.163.239.254:3000/impact', JSON.stringify({
    //       date: 08/08/1992,
    //       force: 100,
    //       users_id: 1,
    //       pothole_id: 1}), {headers: this.headers})
    //     .toPromise()
    //     .then(res => console.log(res.json().data))
    //     .catch(this.handleError);
    // }
  // createImpact(shake: Number, loc: Array<number>): Promise<Impact> {
  //   return this.http
  //     // .post(this.heroesUrl, JSON.stringify({name: name}), {headers: this.headers})
  //     .post(this.heroesUrl, JSON.stringify({
  //       date: 08/08/1992,
  //       force: 100,
  //       users_id: 1,
  //       pothole_id: 1}), {headers: this.headers})
  //     .toPromise()
  //     .then(res => res.json().data as Impact)
  //     .catch(this.handleError);
  // }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  // create(name: string): Promise<Hero> {
  //   return this.http
  //     .post(this.heroesUrl, JSON.stringify({name: name}), {headers: this.headers})
  //     .toPromise()
  //     .then(res => res.json().data as Hero)
  //     .catch(this.handleError);
  // }
  // getHoles(): Promise<Hero[]> {
  //   return this.http.get(this.heroesUrl)
  //              .toPromise()
  //              .then(response => response.json().data as Hero[])
  //              .catch(this.handleError);
  // }
  // getHero(id: number): Promise<Hero> {
  //   const url = `${this.heroesUrl}/${id}`;
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(response => response.json().data as Hero)
  //     .catch(this.handleError);
  // }

  // delete(id: number): Promise<void> {
  //   const url = `${this.heroesUrl}/${id}`;
  //   return this.http.delete(url, {headers: this.headers})
  //     .toPromise()
  //     .then(() => null)
  //     .catch(this.handleError);
  // }
  // update(hero: Hero): Promise<Hero> {
  //   const url = `${this.heroesUrl}/${hero.id}`;
  //   return this.http
  //     .put(url, JSON.stringify(hero), {headers: this.headers})
  //     .toPromise()
  //     .then(() => hero)
  //     .catch(this.handleError);
  // }
}