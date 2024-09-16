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

export interface Segmento {
  id: number;
  value: string;
  label: string;
  fonemas: string[];
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
  listFonemas: string[] = [];
  otroFonema: boolean = false;

  objectForm = new FormGroup({
    fonema: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    tipoTrastorno: new FormControl('', [Validators.required]),
    palabraCorrecta: new FormControl('', [Validators.required]),
    palabraPronunciada: new FormControl('', [Validators.required]),
    segmento: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),
  });

  selectTipoTrastorno: TipoTrastorno[] = [
    { id: 1, value: 'omision', label: 'Omisión' },
    { id: 2, value: 'distorsion', label: 'Distorsión' },
    { id: 3, value: 'sustitución', label: 'Sustitución' },
    { id: 4, value: 'logrado', label: 'Logrado' },
  ];

  segmentos: Segmento[] = [
    { id: 1, 
      value: 'nasales', 
      label: 'Nasales', 
      fonemas: ['m', 'n', 'ñ'] 
    },
    {
      id: 2,
      value: 'oclusivas_sordas',
      label: 'Oclusivas Sordas',
      fonemas: ['p', 't', 'k'],
    },
    {
      id: 3,
      value: 'oclusivas_sonoras',
      label: 'Oclusivas Sonoras',
      fonemas: ['b', 'd', 'g'],
    },
    { id: 4, 
      value: 'laterales', 
      label: 'Laterales', 
      fonemas: ['l', 'll'] 
    },
    {
      id: 5,
      value: 'fricativas',
      label: 'Fricativas',
      fonemas: ['f', 's', 'j', 'z', 'x'],
    },
    { id: 6, 
      value: 'africada', 
      label: 'Africada', 
      fonemas: ['ch'] 
    },
    {
      id: 7,
      value: 'roticas_percusivas',
      label: 'Roticas Percusivas',
      fonemas: ['r'],
    },
    {
      id: 8,
      value: 'roticas_vibrantes',
      label: 'Roticas Vibrantes',
      fonemas: ['rr'],
    },
    {
      id: 9,
      value: 'grupos_consonanticos_laterales',
      label: 'Grupos Consonanticos Laterales',
      fonemas: ['pl', 'bl', 'tl', 'dl', 'cl', 'gl'],
    },
    {
      id: 10,
      value: 'grupos_consonanticos_centrales',
      label: 'Grupos Consonanticos Centrales',
      fonemas: ['pr', 'br', 'fr', 'tr', 'dr', 'cr', 'gr'],
    },
    {
      id: 11,
      value: 'vocales',
      label: 'Vocales',
      fonemas: ['a', 'e', 'i', 'o', 'u'],
    },
    {
      id: 12,
      value: 'diptongos',
      label: 'Diptongos',
      fonemas: ['ua', 'io', 'ie', 'ue', 'ia', 'au', 'ei', 'ai', 'ui'],
    },
  ];

  constructor(
    private storage: Storage,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {}

  onChangeSegmento(event: any) {
    console.log(event.target.value);
    if (event.target.value) {
      const segmento = this.segmentos.find(
        (segmento) => segmento.value === event.target.value
      ) || { fonemas: [] };
      this.listFonemas = segmento.fonemas;
    }
  }

  changeOtrosOption() {
    if (this.objectForm.get('fonema')?.value == 'otros') {
      this.otroFonema = true;
      this.objectForm.get('fonema')?.setValue('');
    } else {
      this.otroFonema = false;
    }
  }

  changeMethodFile() {
    this.upload = true;
    this.objectForm.get('file')?.setValue(null);
  }

  changeMethodRecord() {
    this.upload = false;
    this.objectForm.get('file')?.setValue(null);
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  onFileUpload(event: any) {
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
    const palabraCorrecta = this.objectForm.get('palabraCorrecta')?.value;
    const palabraPronunciada = this.objectForm.get('palabraPronunciada')?.value;
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '-');
    return `${fonema}_${tipoTrastorno}_${palabraCorrecta}_${palabraPronunciada}_${currentTime}.wav`;
  }

  generateNewFileName(file: File): string {
    const fonema = this.objectForm.get('fonema')?.value?.toLowerCase();
    const tipoTrastorno = this.objectForm.get('tipoTrastorno')?.value;
    const palabraCorrecta = this.objectForm.get('palabraCorrecta')?.value;
    const palabraPronunciada = this.objectForm.get('palabraPronunciada')?.value;
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '-');
    const extension = file.name.split('.').pop();
    return `${fonema}_${tipoTrastorno}_${palabraCorrecta}_${palabraPronunciada}_${currentTime}.${extension}`;
  }

  onSubmit() {
    this.loading = true;
    if (!this.objectForm.invalid) {
      const segmento = this.objectForm.get('segmento')?.value;
      const fonema = this.objectForm.get('fonema')?.value?.toLowerCase();
      const tipoTrastorno = this.objectForm.get('tipoTrastorno')?.value;
      const path =
        'audios/' + segmento + '/' + fonema + '/' + tipoTrastorno + '/';

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
