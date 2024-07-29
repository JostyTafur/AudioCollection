import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioFormComponent } from './audio-form/audio-form.component';
import { AudioRecordComponent } from './audio-record/audio-record.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';



@NgModule({
  declarations: [
    AudioFormComponent,
    AudioRecordComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularFireModule,
    AngularFireStorageModule
  ],
  exports: [
    AudioFormComponent,
    AudioRecordComponent,
  ]
})
export class ComponentsModule { }
