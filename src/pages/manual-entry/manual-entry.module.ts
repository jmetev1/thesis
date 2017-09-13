import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManualEntryPage } from './manual-entry';

@NgModule({
  declarations: [
    ManualEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(ManualEntryPage),
  ],
})
export class ManualEntryPageModule {}
