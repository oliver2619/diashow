import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideStabilityDebugging } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { showReducer } from './reducer/show.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideStore(),
    provideState('show', showReducer),
  ],
};
