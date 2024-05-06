import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { boardsFeatureKey, boardsReducer } from './store/boards/reducers';
import * as boardsEffects from './store/boards/effects';
import * as currentBoardEffects from './store/current-board/effects'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideStore(),
    provideState(boardsFeatureKey, boardsReducer),
    provideEffects(boardsEffects, currentBoardEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    })
  ],
};
