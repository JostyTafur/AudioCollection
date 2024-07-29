import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'audio-collector-85c75',
        appId: '1:338080556980:web:154117b1fe0a0abf1b34e1',
        storageBucket: 'audio-collector-85c75.appspot.com',
        apiKey: 'AIzaSyAS6DwtPuu9mmLHMt7BXNMYF_TjykMJ-VU',
        authDomain: 'audio-collector-85c75.firebaseapp.com',
        messagingSenderId: '338080556980',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideHttpClient(),
  ],
};
