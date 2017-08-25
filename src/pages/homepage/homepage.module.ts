import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Homepage } from './homepage';

@NgModule({
  declarations: [
    Homepage,
  ],
  imports: [
    IonicPageModule.forChild(Homepage),
  ],
})
export class HomepagePageModule {}
