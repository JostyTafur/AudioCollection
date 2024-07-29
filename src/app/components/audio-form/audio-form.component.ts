import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface TipoTrastorno {
  id: number;
  value: string;
  label: string;
}

@Component({
  selector: 'app-audio-form',
  templateUrl: './audio-form.component.html',
  styleUrl: './audio-form.component.css',
})
export class AudioFormComponent {
  upload: boolean = false;
  fileUpload: boolean = false;
  loading: boolean = false;

  audioFile: File | null = null;
  audioSrcURL: string | null = null;
  audioElement: any;
  storageRef: any;

  objectForm = new FormGroup({
    fonema: new FormControl('', [Validators.required, Validators.maxLength(1)]),
    tipoTrastorno: new FormControl('', [Validators.required]),
    palabra: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),
  });

  selectTipoTrastorno: TipoTrastorno[] = [
    { id: 1, value: 'omision', label: 'Omisión' },
    { id: 2, value: 'distorsion', label: 'Distorsión' },
    { id: 3, value: 'sustitución', label: 'Sustitución' },
  ];

  constructor(private storage: Storage, private domSanitizer: DomSanitizer, private router: Router) {}

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  onChangeUpload(event: any) {
    this.fileUpload = true;
    this.audioFile = event.target.files[0];
    this.objectForm.get('file')?.setValue(this.audioFile?.name!);
    this.audioSrcURL = URL.createObjectURL(event.target.files[0]);
  }

  restartUpload() {
    this.fileUpload = false;
    this.audioFile = null;
    this.objectForm.get('file')?.setValue(null);
    this.audioSrcURL = null;
  }

  onRecordingComplete(recording: Blob) {
    const blob = recording;
    const filename = this.generateFileRecordedName();
    this.audioFile = new File([blob], filename, { type: 'audio/wav' });
    this.objectForm.get('file')?.setValue(this.audioFile?.name!);
    console.log(this.audioFile);
  }

  generateFileRecordedName(): string {
    const fonema = this.objectForm.get('fonema')?.value?.toLowerCase();
    const tipoTrastorno = this.objectForm.get('tipoTrastorno')?.value;
    const palabras = this.objectForm.get('palabra')?.value;
    return `${fonema}_${tipoTrastorno}_${palabras}.wav`;
  }

  generateNewFileName(file: File): string {
    const fonema = this.objectForm.get('fonema')?.value?.toLowerCase();
    const tipoTrastorno = this.objectForm.get('tipoTrastorno')?.value;
    const palabras = this.objectForm.get('palabra')?.value;
    const extension = file.name.split('.').pop();
    return `${fonema}_${tipoTrastorno}_${palabras}.${extension}`;
  }

  onSubmit() {
    this.loading = true;
    if (!this.objectForm.invalid) {
      const fonema = this.objectForm.get('fonema')?.value?.toLowerCase();
      const tipoTrastorno = this.objectForm.get('tipoTrastorno')?.value;
      const path = 'audios/' + fonema + '/' + tipoTrastorno + '/';

      if (this.upload) {
        this.storageRef = ref(
          this.storage,
          path + this.generateNewFileName(this.audioFile!)
        );
      } else {
        this.storageRef = ref(this.storage, path + this.audioFile!.name);
      }
      uploadBytesResumable(this.storageRef, this.audioFile!).then(() => {
        this.loading = false;
        this.router.navigate(['/successful']);
      });
    }
  }
}
