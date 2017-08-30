import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule }   from '@angular/forms';
import { MyApp } from './app.component';

import { Homepage } from '../pages/homepage/homepage';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DeviceMotion } from '@ionic-native/device-motion';
import { NativeAudio } from '@ionic-native/native-audio';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http'

@NgModule({
  declarations: [
    MyApp,
    Homepage,
    ItemDetailsPage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Homepage,
    ItemDetailsPage,
    ListPage
  ],
  providers: [
    NativeAudio,
    DeviceMotion,
    Geolocation,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
