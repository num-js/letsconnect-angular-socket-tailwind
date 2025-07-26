import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { SocketIoConfig, provideSocketIo } from 'ngx-socket-io';

const socketConfig: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideSocketIo(socketConfig),
  ]
};
