import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { DeviceMotion } from '@ionic-native/device-motion';
import { RequestService } from '../../app/request.service'
import { SmartAudio } from '../../providers/smart-audio/smart-audio'
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Geolocation } from '@ionic-native/geolocation';
import {NativeGeocoder } from '@ionic-native/native-geocoder'
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-homepage',
  templateUrl: 'homepage.html'
})
export class Homepage {
  private moveCounter:number = 0;
  trigger: string = 'none'
  jolts: Array<number> = [1, 1, 1]
  limit:number= 3
  joltSize:number = 18;
  coords: any = {latitude: 100, longitude: 100, heading: 100}
  holes: any = [1,1,1]
  realGeo: boolean  = false
  trackerStarted:Boolean = false
  joltWatcherStarted: Boolean = false
  toSave: any = [1, 2, 3]
  workOrder: number = 0;
  closest: object = {heading: 1000, lat: 1, lng: 1}
  subscription
  used: object = {}

  constructor(private geolocation: Geolocation,
    private gc: NativeGeocoder,
    private tts: TextToSpeech,
    private requestService: RequestService,
    public smartAudio: SmartAudio,
    public platform: Platform,
    private nativeStorage: NativeStorage,
    private deviceMotion: DeviceMotion) {}
  ionViewDidEnter(){
    this.platform.ready().then(() => {
      this.watchLoc()
    })
  }
  makeFake(force) {
    this.realGeo = false
    this.subscription ? this.subscription.unsubscribe() : 1
    this.coords = {latitude: 29.927594 + Math.random() * .08865,
      longitude:  -90.132690 + Math.random() * .196903,
      heading: 0}
    this.saveImpact(force)
  }
  realLocationToggle() {
    this.subscription ? this.subscription.unsubscribe() : 1
    this.realGeo=!this.realGeo
    this.watchLoc()
  }
  watchLoc() {
    const cb = (data) => {
      this.coords = data.coords
      this.requestService.getPotholes().then(potholes => {
        !this.trackerStarted ? (
          this.tracker(potholes), this.trackerStarted = true) : 1
      })
      if (!this.joltWatcherStarted) {
        this.platform.is('cordova') ? (
          this.joltWatcher(), this.joltWatcherStarted = true
        ) : 1
      }
    }
    let latitude, longitude, heading
    this.realGeo ? (this.subscription = this.geolocation.watchPosition(
      {enableHighAccuracy: true}).subscribe(loc => cb(loc))) : (
      latitude = 29.927594 + Math.random() * .08865,
      longitude = -90.132690 + Math.random() * .196903,
      heading = 0,
      cb({coords: {latitude, longitude, heading}})
    )
  }
  joltWatcher = () => {
    let lastX, lastY, lastZ
    this.deviceMotion.watchAcceleration({frequency:200})
    .subscribe(acc => {lastX ? 1 : {x: lastX, y: lastY, z: lastZ} = acc;
      let total = Math.abs(acc.x-lastX) +
      Math.abs(acc.y-lastY) + Math.abs(acc.z-lastZ)
      total > this.joltSize ? (
        this.moveCounter++, this.jolts.push(total)
      ) : (
        this.moveCounter = Math.max(0, --this.moveCounter),
        this.jolts = []
      )
      if(this.moveCounter > this.limit) {
        this.saveImpact(this.jolts)
        this.jolts = []
        this.moveCounter=0;
      }
      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    });
  }
  getPotholes(): void {
    this.requestService.getPotholes()
    .then(values => this.holes = values)
  }
  bearing(lat1,lng1,lat2,lng2) { //ph goes in 2 spot
    const toRad = (deg) => deg * Math.PI / 180
    const toDeg = (rad) => rad * 180 / Math.PI
    var dLon = toRad(lng2-lng1);
    var y = Math.sin(dLon) * Math.cos(toRad(lat2));
    var x = Math.cos(toRad(lat1))*Math.sin(toRad(lat2)) - Math.sin(toRad(lat1))*Math.cos(toRad(lat2))*Math.cos(dLon);
    var brng = toDeg(Math.atan2(y, x));
    return ((brng + 360) % 360);
  }
  warner(pits) { //loop over pits, if within 40 +- or heading, warn
    let closest = {d: 100, lat: 100, lng: 100}
    pits.forEach(p => {
      p.d < closest.d ? closest = p : 1
      let b = this.bearing(this.coords.latitude, this.coords.longitude, p.lat, p.lng)
      let myB = Number(this.coords.heading)
      console.log(b, myB)
      this.trigger = `to closest is ${b}, your b is ${myB}`
      let mes
      let rounded = p.d.toString().slice(0,3)
      let range1 = [myB - 20, myB + 20]
      let range = range1.map(head => {
        return head < 0 ? 360 + head : head > 360 ? head - 360 : head
      })
      if (b < range[1] && b > 0 || b > range[0] && b < 360) {
        let addr
        this.gc.reverseGeocode(p.lat, p.lng)
        .then((result) => {
          addr = result.subThoroughfare +' '+ result.thoroughfare
          this.used[JSON.stringify(addr)] === true ? 1 : (
            this.used[JSON.stringify(addr)] = true,
            mes = `Approaching ${p.name} ${rounded} miles ahead at ${addr}`,
            console.log(mes),
            this.platform.is('cordova') ? this.tts.speak(mes) : 1
          )
        })
      }
    })
  }
  tracker(holes) {
    //.25 is too small
    let watching = {'1': {t: 3, d: .5, st: holes.slice()},
                    '2': {t: 10, d: .8, st: []},
                    '3': {t: 20, d: 2, st: []}}
    let workOrder = this.workOrder
    const sorter = (object, index) => { //sorting
      let sorted = {'1': [],'2': [], '3': []}
      object.st.forEach(h => {
        h.d = this.getDist(this.coords.latitude, this.coords.longitude,
          h.lat, h.lng)
        h.d < watching['1'].d ? sorted['1'].push(h) : (
          h.d < watching['2'].d ? sorted['2'].push(h) : (
            h.d < watching['3'].d ? sorted['3'].push(h) : 1
        ))
      })
      for (let key in watching) {
        key === index ? watching[key].st = sorted[key].slice() : watching[key].st = watching[key].st.concat(sorted[key]);
        console.log('category', index, 'has this many potholes', watching[index].st.length)
      }
      index === '1' ? (this.warner(watching[index].st)): 1
      workOrder === this.workOrder ? (setTimeout(() => {
        sorter(watching[index], index) }, watching[index].t * 1000)
      ) : 1
    }
    for (let key in watching) {
      sorter(watching[key], key)
    }
    setTimeout(() => {
      this.requestService.getPotholes().then(potholes => {
        // console.log('new has', potholes.length, 'potholes', 'workorder before is ', this.workOrder)
        this.workOrder++
        this.tracker(potholes)
      })
    }, 60000)
  }
  saveImpact(jolts) {
    const round = (t, d) => Number(Math.round(Number(t+'e'+d))+'e-'+d)
    this.speak(jolts)
    let latitude = round(this.coords.latitude, 4)
    let longitude = round(this.coords.longitude, 4)
    jolts = jolts.map(j => Math.floor(j))
    this.toSave = [latitude, longitude, jolts]
    this.requestService.getPotholeByLocation(latitude, longitude)
    .then(data => {
      if (!data) {
        this.requestService.createPothole({
          name: this.name(),
          lat: latitude,
          lng: longitude
        })
        .then(hole => {
          console.log(103)
          this.nativeStorage.getItem('user')
            .then(user => {
              this.requestService.createImpact({
                force: jolts,
                users_id: user.id,
                pothole_id: hole.id
              }).then(impact => console.log(impact, 108))
            })
        })
      } else {
        this.nativeStorage.getItem('user')
          .then(user => {
            this.requestService.createImpact({
              force: jolts,
              users_id: user.id,
              pothole_id: data[0].id
            }).then(impact => console.log(impact, 'impact saved'))
          })
      }
    })
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
  speak(ar) {
    let str = ar.reduce((a, c) => `${a} ${Number(c.toString().slice(0, 3))
      .toString()} gees,`, '')
    this.tts.speak(`That impact was ${str}`)
  }
   // Credit: http://stackoverflow.com/a/27943/52160
   getDist(lat1,lon1,lat2,lon2) {
    const deg2rad = (deg) => deg * (Math.PI/180)
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    return 7919.204 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
}