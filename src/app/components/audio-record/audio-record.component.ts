import { Component, EventEmitter, Input, Output } from '@angular/core';
declare var $: any;
import { DomSanitizer } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';
import { Modal } from 'flowbite';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-audio-record',
  // standalone: true,
  // imports: [],
  templateUrl: './audio-record.component.html',
  styleUrl: './audio-record.component.css',
})
export class AudioRecordComponent {
  @Output() recordingComplete = new EventEmitter();
  title = 'micRecorder';
  //Lets declare Record OBJ
  record: any;
  //Will use this flag for toggeling recording
  recordState = "recordInit";
  //URL of Blob
  url: any;
  error: any;

  typeModal = '';

  constructor(
    private domSanitizer: DomSanitizer,
  ) {}

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  /**
   * Start recording.
   */
  initiateRecording() {
    this.recordState = "recording";
    let mediaConstraints = {
      video: false,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  /**
   * Will be called automatically.
   */
  successCallback(stream: any) {
    var options: RecordRTC.Options = {
      mimeType: 'audio/wav',
      numberOfAudioChannels: 2,
    };
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }
  /**
   * Stop recording.
   */
  stopRecording() {
    this.recordState = 'recorded';
    this.record.stop(this.processRecording.bind(this));
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  processRecording(blob: any) {
    this.url = URL.createObjectURL(blob);
    this.recordingComplete.emit(blob);
    this.record.clearRecordedData();
  }

  recordAgain() {
    this.recordState = 'recordInit';
    this.url = null;
  }
  /**
   * Process Error.
   */
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }
  ngOnInit() {}
}
